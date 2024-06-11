import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {/*
  conversations: any[] = [];
  messages: any[] = [];
  selectedConversationId: number | null = null;
  newMessage: string = '';
  userId: number = 0;
  private messageSubscription: Subscription | null = null;

  constructor(private messageService: MessageService, private sessionStorage: SessionStorageService) {}
*/
  ngOnInit(): void {/*
    this.userId = Number(sessionStorage.getItem('ngx-webstorage|userid'));
    this.loadConversations();*/
  }
/*
  loadConversations(): void {
    this.messageService.getConversations(this.userId).subscribe((conversations: any[]) => {
      this.conversations = conversations;
    });
  }

  selectConversation(conversationId: number): void {
    this.selectedConversationId = conversationId;
    this.loadMessages(conversationId);
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.messageSubscription = this.messageService.streamMessages(conversationId).subscribe((message: any) => {
      if (this.selectedConversationId === conversationId) {
        this.loadMessages(conversationId);
      }
    });
  }

  loadMessages(conversationId: number): void {
    this.messageService.getMessages(conversationId).subscribe((messages: any[]) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedConversationId) {
      const message = {
        senderId: this.userId,
        content: this.newMessage
      };
      this.messageService.sendMessage(this.selectedConversationId, message).subscribe(() => {
        this.newMessage = '';
      });
    }
  }
*/
  ngOnDestroy(): void {/*
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }*/
  }/*
  getParticipantIds(conversation: any): string {
    return conversation.participants.map((p: any) => p.id).join(', ');
  }
}
*/
}