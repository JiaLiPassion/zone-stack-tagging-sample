import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { zip, interval, sample, from } from 'rxjs';

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

  rxjs() {
    const sequence = from(['Joe', 'Frank', 'Bob']);
    const source = zip(sequence, interval(2000));
    source.pipe(sample(interval(2500))).subscribe(console.trace);
  }

  async nested() {
    await Promise.resolve(1).then(
      () => new Promise((res) => setTimeout(res, 100))
    );
    console.trace();
  }
}
