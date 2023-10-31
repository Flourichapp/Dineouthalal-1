import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import DOMPurify from 'dompurify';
@Pipe({
  name: 'safeHtmlPipe'
})
export class SafeHtmlPipePipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  constructor(private sanitizer:DomSanitizer){}

  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
