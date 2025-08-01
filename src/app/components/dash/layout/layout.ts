import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  isAdmin = true;
  constructor(
    private auth: AuthService, 
    private token: TokenService,
    private router: Router) {}

ngOnInit() {
    this.isAdmin = this.token.isAdmin() ?? false;
  }
  logOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
