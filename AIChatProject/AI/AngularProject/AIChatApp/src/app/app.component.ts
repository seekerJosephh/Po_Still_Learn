import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from './skeleton/skeleton.component'
import { GeminiService } from './gemini.service';
import { CommonModule } from '@angular/common';

//Test
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SkeletonComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {

  title = 'my-angular-app';

  prompt: string = '';

  geminiService: GeminiService = inject(GeminiService);

  loading: boolean = false;
  isDarkMode: boolean = false; 

  chatHistory: any[] = [];
  botTypingMessage: string = '';
  typingInProgress: boolean = false;
  constructor() {
    this.geminiService.getMessageHistory().subscribe((res) => {
      if(res) {
        this.chatHistory.push(res);
        if (res.from === 'bot') {
          // Start the typing effect for bot response
          this.simulateTypingEffect(res.message);
        }
      }
    });
  }

  async sendData() {
    if(this.prompt && !this.loading) {
      this.loading = true;
      const data = this.prompt;
      this.prompt = '';
      await this.geminiService.generateText(data);
      this.loading = false;
    }
  }

  // Text writing/ Typing effect
  simulateTypingEffect(text: string) {
    this.botTypingMessage = ''; // Reset the typing message
    this.typingInProgress = true;
    let index = 0;

    const typingInterval = interval(50); // 50ms between each letter
    const subscribe = typingInterval.pipe(
      takeWhile(()  => index < text.length)
    ).subscribe(()  => {
      this.botTypingMessage += text.charAt(index);
      index++;
      if(index >= text.length) {
        this.typingInProgress = false;
        subscribe.unsubscribe();
      }
    });
  }

  // FormatAPI Response
  formatApiResponse(responseText: string): string {
    // Replace ** with <strong> for bold
  responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  responseText = responseText.replace(/\*(.*?)\*/g, '<em>1$</em>');
    return responseText;
  }

  formatText(text: string) {
    const result = text.replaceAll('*', '');
    return result;
  }
}




/// Test 




// import { Component, inject } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { SkeletonComponent } from './skeleton/skeleton.component';
// import { GeminiService } from './gemini.service';
// import { CommonModule } from '@angular/common';
// import { interval } from 'rxjs';
// import { takeWhile } from 'rxjs/operators';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, SkeletonComponent, FormsModule, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'my-angular-app';
//   prompt: string = '';
//   geminiService: GeminiService = inject(GeminiService);
//   loading: boolean = false;
//   chatHistory: any[] = [];
//   typingSpeed: number = 50; // Speed for the typing effect (in ms)

//   constructor() {
//     this.geminiService.getMessageHistory().subscribe((res) => {
//       if (res) {
//         this.chatHistory.push(res);
//       }
//     });
//   }

//   async sendData() {
//     if (this.prompt && !this.loading) {
//       // Add user message
//       this.chatHistory.push({ from: 'user', message: this.prompt });
//       const userInput = this.prompt;
//       this.prompt = '';
//       this.loading = true;

//       // Call service to get bot response
//       const botResponse = await this.geminiService.generateText(userInput);

//       // Start typing effect for bot message
//       // this.addBotMessage(botResponse);
//     }
//   }

//   addBotMessage(fullText: string) {
//     let index = 0;
//     let message = '';

//     // Use RxJS interval to simulate typing effect
//     interval(this.typingSpeed)
//       .pipe(takeWhile(() => index < fullText.length))
//       .subscribe(() => {
//         message += fullText[index++];
//         this.updateBotMessage(message);
//       }, () => {},
//       () => {
//         this.loading = false; // Typing finished
//       });
//   }

//   updateBotMessage(currentMessage: string) {
//     // Find the latest bot message and update it gradually
//     const botMessageIndex = this.chatHistory.length - 1;
//     if (this.chatHistory[botMessageIndex] && this.chatHistory[botMessageIndex].from === 'bot') {
//       this.chatHistory[botMessageIndex].message = currentMessage;
//     } else {
//       // If there is no existing bot message, add a new entry
//       this.chatHistory.push({ from: 'bot', message: currentMessage });
//     }
//   }

//   formatText(text: string) {
//     return text.replaceAll('*', '');
//   }
// }


