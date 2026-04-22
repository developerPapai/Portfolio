import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from '../../core/services/messages.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {
  private messagesService = inject(MessagesService);
  
  messages: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading = true;
    this.messagesService.getMessages().subscribe({
      next: (res) => {
        // Map backend 'read' to 'isRead' if needed, or just use 'read'
        this.messages = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.isLoading = false;
      }
    });
  }

  markAsRead(id: string) {
    this.messagesService.markAsRead(id).subscribe({
      next: () => {
        const msg = this.messages.find(m => m._id === id);
        if (msg) msg.read = true;
      }
    });
  }

  deleteMessage(id: string) {
    Swal.fire({
      title: 'Delete Message?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#16161f',
      color: '#f0f0f5'
    }).then((result) => {
      if (result.isConfirmed) {
        this.messagesService.deleteMessage(id).subscribe({
          next: () => {
            Swal.fire({ 
              toast: true, 
              position: 'top-end', 
              icon: 'success', 
              title: 'Message deleted', 
              showConfirmButton: false, 
              timer: 3000,
              background: '#16161f',
              color: '#f0f0f5'
            });
            this.messages = this.messages.filter(m => m._id !== id);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete message',
              background: '#16161f',
              color: '#f0f0f5'
            });
            console.error(err);
          }
        });
      }
    });
  }

  replyByEmail(msg: any) {
    const subject = encodeURIComponent(`Re: ${msg.subject || 'Portfolio Contact'}`);
    const body = encodeURIComponent(`\n\n--- Original Message ---\nFrom: ${msg.name}\nSubject: ${msg.subject}\n\n${msg.message}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  }
}
