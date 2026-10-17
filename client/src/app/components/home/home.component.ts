import QRCode from 'qrcode';
import { Url } from '../../services/url';
import { CommonModule } from '@angular/common';
import { UrlItem } from '../../models/url-item';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class Home {
  private readonly urlService = inject(Url);
  private readonly formBuilder = inject(FormBuilder);

  readonly urlForm = this.formBuilder.group({
    originalUrl: [
      '',
      [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)],
    ],
  });

  createdLink: UrlItem | null = null;
  generatedQrUrl: string | null = null;
  isSubmitting: boolean = false;
  isQrLoading: boolean = false;
  apiMessage: { type: 'success' | 'danger'; text: string } | null = null;

  get hasUrlError(): boolean {
    const control = this.urlForm.get('originalUrl');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  shortenUrl() {
    if (this.urlForm.invalid) {
      this.urlForm.markAllAsTouched();
      return;
    }
    const originalUrl = this.urlForm.value.originalUrl?.trim() ?? '';
    this.isSubmitting = true;
    this.apiMessage = null;
    this.createdLink = null;
    this.generatedQrUrl = null;

    this.urlService.shortenUrl(originalUrl).subscribe({
      next: async (response) => {
        this.apiMessage = { type: 'success', text: response.message };
        this.createdLink = response.data;
        this.isSubmitting = false;

        // Auto-generate QR code alongside the short URL
        if (this.createdLink?.short_url) {
          await this.generateQr(this.createdLink.short_url);
        }
      },
      error: (error) => {
        this.apiMessage = {
          type: 'danger',
          text: error.error?.message || 'An error occurred while shortening the URL.',
        };
        this.isSubmitting = false;
      },
    });
  }

  async generateQr(shortUrl: string) {
    this.isQrLoading = true;
    try {
      this.generatedQrUrl = await QRCode.toDataURL(shortUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#141614',
          light: '#f2f3f2',
        },
      });
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    } finally {
      this.isQrLoading = false;
    }
  }

  async copyLink(shortUrl: string) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      this.apiMessage = { type: 'success', text: 'Link copied to clipboard!' };
    } catch (error) {
      this.apiMessage = { type: 'danger', text: 'Failed to copy link.' };
    }
  }
}
