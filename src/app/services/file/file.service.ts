import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class FileService {
  // http://localhost/v1/storage/files/6071907e75e16/view?project=5ff3746285d7a
  fileUrl: string = 'http://localhost:4200/storage/files/'

  constructor(private http: HttpClient) { }

  getTextFile(fileId: string) {
    let url = this.buildFileUrl(fileId)
    console.log('url', url)

    return this.http.get(url, {
      responseType: 'text'
    }).toPromise();
  }

  buildFileUrl(fileId: string): string {
    return `${this.fileUrl}${fileId}/download?project=${environment.projectId}`
  }
}
