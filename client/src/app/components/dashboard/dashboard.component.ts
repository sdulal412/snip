import QRCode from 'qrcode';
import { Url } from '../../services/url';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UrlItem } from '../../models/url-item';
import { Component, inject, OnInit } from '@angular/core';

type SortOption = 'newest' | 'oldest' | 'most-clicks' | 'least-clicks';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  styleUrl: './dashboard.component.css',
  templateUrl: './dashboard.component.html',
})
export class Dashboard implements OnInit {
  private readonly urlService = inject(Url);
  urls: UrlItem[] = [];
  searchTerm: string = '';
  sortBy: SortOption = 'newest';
  isLoading: boolean = false;
  isDeletingId: number | null = null;
  activeQrId: number | null = null;
  qrLoadingId: number | null = null;
  qrImageMap: Record<number, string> = {};

  pendingDeleteTarget: UrlItem | null = null;
  message: { type: 'success' | 'danger'; text: string } | null = null;

  ngOnInit(): void {
    this.loadUrls();
  }

  get filteredUrls(): UrlItem[] {
    const query = this.searchTerm.toLowerCase();
    const filtered = this.urls.filter((item) => {
      if (!query) return true;
      return (
        item.original_url.toLowerCase().includes(query) ||
        item.short_code.toLowerCase().includes(query) ||
        item.short_url.toLowerCase().includes(query)
      );
    });
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (this.sortBy === 'most-clicks') return b.clicks - a.clicks;
      if (this.sortBy === 'least-clicks') return a.clicks - b.clicks;
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return this.sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }

  async toggleQr(item: UrlItem) {
    if (this.activeQrId === item.id) {
      this.activeQrId = null;
      return;
    }
    this.activeQrId = item.id;
    if (this.qrImageMap[item.id]) {
      return;
    }
    this.qrLoadingId = item.id;
    try {
      const qrDataUrl = await QRCode.toDataURL(item.short_url, {
        width: 220,
        margin: 1,
        color: {
          dark: '#141614',
          light: '#33ff33',
        },
      });
      this.qrImageMap[item.id] = qrDataUrl;
    } catch (error) {
      this.message = { type: 'danger', text: 'Failed to generate QR code.' };
      this.activeQrId = null;
    } finally {
      this.qrLoadingId = null;
    }
  }

  loadUrls() {
    this.isLoading = true;
    this.urlService.getUrls().subscribe({
      next: (response) => {
        this.urls = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching URLs:', error);
        this.isLoading = false;
      },
    });
  }

  promptDelete(item: UrlItem) {
    this.pendingDeleteTarget = item;
  }

  cancelDelete() {
    this.pendingDeleteTarget = null;
  }

  confirmDelete() {
    if (!this.pendingDeleteTarget) return;

    const id = this.pendingDeleteTarget.id;
    this.isDeletingId = id;

    this.urlService.deleteUrl(id).subscribe({
      next: (response) => {
        this.message = { type: 'success', text: response.message };
        this.urls = this.urls.filter((url) => url.id !== id);
        this.isDeletingId = null;
        this.pendingDeleteTarget = null;
      },
      error: (error) => {
        this.message = { type: 'danger', text: 'Failed to delete URL.' };
        this.isDeletingId = null;
        this.pendingDeleteTarget = null;
      },
    });
  }

  async copyLink(shortUrl: string) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      this.message = { type: 'success', text: 'Link copied to clipboard!' };
    } catch (error) {
      this.message = { type: 'danger', text: 'Failed to copy link.' };
    }
  }

  trackById(index: number, item: UrlItem): number {
    return item.id;
  }
}
