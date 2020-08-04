import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { Store } from 'store';

// feature modules

// containers
import { AppComponent } from './app.component';
import { RollGameModule } from './roll-game/roll-game.module';
import { CardModule } from './card/card.module';
import { CommonModule } from '@angular/common';
import { AppRoutes } from './app.routes';

// components


@NgModule({
  imports: [
    BrowserModule,
    RollGameModule,
    CommonModule,
    CardModule,
    RouterModule.forRoot(AppRoutes)
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    Store
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}

/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/6.3.2/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#config-web-app -->

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBLgVKY2C4-z6xffRojXN07lKbJdK3LeBQ",
    authDomain: "daniel-test-application-6fd29.firebaseapp.com",
    databaseURL: "https://daniel-test-application-6fd29.firebaseio.com",
    projectId: "daniel-test-application",
    storageBucket: "daniel-test-application.appspot.com",
    messagingSenderId: "747340293646",
    appId: "1:747340293646:web:ba8b47a62dd4b55d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
</script>
*/