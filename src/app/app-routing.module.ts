import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}