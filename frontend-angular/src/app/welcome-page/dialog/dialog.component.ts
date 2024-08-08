import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AuthService} from "../../auth.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {AvatarScrollComponent} from "./avatar-scroll/avatar-scroll.component";


interface Avatar {
  id: number;
  url: string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    NgOptimizedImage,
    AvatarScrollComponent
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {
  form!: FormGroup;
  selectedAvatar: Avatar | null = null;
  avatars: Avatar[] = [
    { id: 1, url: '/avatars/avatar_1.png' },
    { id: 2, url: '/avatars/avatar_2.png' },
    { id: 3, url: '/avatars/avatar_3.png' },
    { id: 4, url: '/avatars/avatar_4.png' },
    { id: 5, url: '/avatars/avatar_5.png' },
    { id: 6, url: '/avatars/avatar_6.png' },
    { id: 7, url: '/avatars/avatar_7.png' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      avatar: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.updateErrorMessages();
    });

    // Initial check to set errors correctly on load
    this.updateErrorMessages();
  }

  onAvatarSelected(avatar: Avatar): void {
    this.selectedAvatar = avatar;
    this.form.get('avatar')?.setValue(avatar.url);
  }

  updateErrorMessages() {
    const username = this.form.get('username')?.value;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    const repeatPassword = this.form.get('repeatPassword')?.value;

    this.form.get('username')?.setErrors(
      this.authService.usernameExists(username) ? { usernameExists: 'Username already exists' } : null
    );

    this.form.get('email')?.setErrors(
      this.authService.emailExists(email) ? { emailExists: 'Email already exists' } : null
    );

    if (password !== repeatPassword) {
      this.form.get('repeatPassword')?.setErrors({ passwordsMismatch: 'Passwords do not match' });
    } else {
      this.form.get('repeatPassword')?.setErrors(null);
    }

    this.cdr.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.updateErrorMessages();
    if (this.form.valid) {
      const userData = this.form.value;
      this.authService.addUser(userData.username, userData.email, userData.password, userData.avatar).subscribe({
        next: (res) => {
          console.log('User added successfully', res);
          this.dialogRef.close(userData);
          this.router.navigate(['/lessons']);
        },
        error: (err) => {
          console.error('Failed to add user', err);
        }
      });
    } else {
      console.log('Form contains errors:', this.form.errors);
    }
  }

  getError(el: string): string {
    const control = this.form.get(el);
    if (control?.hasError('required')) {
      return `${el.charAt(0).toUpperCase() + el.slice(1)} required`;
    }
    if (control?.hasError('email')) {
      return 'Invalid email format';
    }
    if (control?.hasError('usernameExists')) {
      return 'Username already exists';
    }
    if (control?.hasError('emailExists')) {
      return 'Email already exists';
    }
    if (control?.hasError('passwordsMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
