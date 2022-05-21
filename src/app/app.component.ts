import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'zone-stack-tagging';

  constructor(private httpClient: HttpClient) {}

  timeout() {
    setTimeout(() => {
      console.trace('timeout callback');
    }, 100);
  }

  xhr() {
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe(console.trace);
  }
  click() {
    console.trace('click');
  }
  promise() {
    Promise.resolve(1).then(() => {
      console.trace('promise resolved');
    });
  }
}
