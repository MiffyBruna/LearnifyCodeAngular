import { Routes } from '@angular/router';
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {LessonsPageComponent} from "./lessons-page/lessons-page.component";
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [] = [
  {
    path: "",
    component: WelcomePageComponent
  },
  {
    path: 'lessons',
    component: LessonsPageComponent
  },
  { 
    path: "demo",
    component: ChatbotComponent
  }
];

export default routes;
