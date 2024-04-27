import { Component, Optional } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { LoggerService } from '../../shared/services/logger.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/services/user.service';
import { TeamService } from '../../shared/services/team.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [LoggerService],
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    //TODO: Add validator to check if password and confirmPassword match.
    password: new FormControl(environment.production ? '' : '12345678', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl(environment.production ? '' : '12345678', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  isLoading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private teamService: TeamService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Optional() private logger?: LoggerService,
  ) {}

  onSignup(formDirective: FormGroupDirective): void {
    if (!this.signupForm.valid || this.isLoading) return;
    if (
      this.signupForm.value.password !== this.signupForm.value.confirmPassword
    ) {
      alert('Passwords do not match');
      return;
    }
    this.isLoading = true;
    this.signupForm.disable();
    this.logger?.log(this.signupForm.value);
    this.authService
      .signup(this.signupForm.value.email, this.signupForm.value.password)
      .then((res) => {
        this.logger?.log(res);
        this.userService
          .createUser({
            id: res.user?.uid ?? '',
            email: this.signupForm.value.email,
            username: this.signupForm.value.username,
            teams: [],
          })
          .then(() => {
            this.logger?.log('User created successfully!');
            this._snackBar.open('Sikeres regisztráció!', 'Ok', {
              duration: 3000,
              verticalPosition: 'top',
            });
            this.router.navigate(['/login']);
          })
          .catch((err) => {
            this.logger?.error(err);
            this._snackBar.open('Sikertelen regisztráció!', 'Ok', {
              duration: 3000,
              verticalPosition: 'top',
            });
          })
          .finally(() => {
            this.signupForm.reset();
            this.signupForm.enable();
            formDirective.resetForm();
            this.isLoading = false;
          });
      })
      .catch((err) => {
        this.logger?.error(err);
        let message: string;
        switch (err.code) {
          case 'auth/email-already-in-use':
            message = 'Ez az ímél cím már használatban van!';
            break;
          case 'auth/invalid-email':
            message = 'Az ímél cím hibás!';
            break;
          case 'auth/weak-password':
            message = 'Túl gyenge jelszó!';
            break;
          default:
            message = `Sikertelen regisztráció! Hiba: ${err.code}`;
            break;
        }
        this._snackBar.open(message, 'Ok', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.signupForm.reset();
        this.signupForm.enable();
        formDirective.resetForm();
        this.isLoading = false;
      });
  }
}
