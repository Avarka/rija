import { Component, Optional } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggerService } from '../../shared/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  isLoading = false;

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Optional() private logger?: LoggerService
  ) {}

  onLogin(formDirective: FormGroupDirective): void {
    if (!this.loginForm.valid || this.isLoading) return;
    this.loginForm.disable();
    this.isLoading = true;
    this.logger?.log(this.loginForm.value);
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        this.logger?.log(res);
        this._snackBar.open('Sikeres bejelentkezés!', 'Ok', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.logger?.error(err);
        let message: string;
        switch (err.code) {
          case 'auth/user-not-found':
            message = 'Hibás ímél cím!';
            break;
          case 'auth/wrong-password':
            message = 'Hibás jelszó!';
            break;
          default:
            message = `Sikertelen bejelentkezés! Hiba: ${err.code}`;
            break;
        }
        this._snackBar.open(message, 'Ok', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.isLoading = false;
        this.loginForm.enable();
      })
      .finally(() => {
        this.isLoading = false;
        this.loginForm.enable();
        formDirective.resetForm();
        this.loginForm.reset();
      });
  }
}
