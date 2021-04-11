import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';
import { CourseDeleteDialogComponent } from '../delete/course-delete-dialog.component';

@Component({
  selector: 'jhi-course',
  templateUrl: './course.component.html',
})
export class CourseComponent implements OnInit {
  courses?: ICourse[];
  isLoading = false;

  constructor(protected courseService: CourseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.courseService.query().subscribe(
      (res: HttpResponse<ICourse[]>) => {
        this.isLoading = false;
        this.courses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICourse): number {
    return item.id!;
  }

  delete(course: ICourse): void {
    const modalRef = this.modalService.open(CourseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.course = course;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
