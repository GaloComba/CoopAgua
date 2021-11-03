  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {path: '/about/',     url: 'about.html'},
      {path: '/index/',     url: 'index.html'},
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$("#bot1").on("click", fndatos);
  
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    $$("#qr").on("click", fnqr)
})

// funciones

var email="";
var contr="";



function fndatos(){
  email=$$("#mail").val();
  contr=$$("#contras").val();
  firebase.auth().signInWithEmailAndPassword(email, contr)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;

    console.log("Bienvenid@!!! " + email);
    mainView.router.navigate("/about/");
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.error(errorCode);
        console.error(errorMessage);
        if(errorCode=="auth/wrong-password"){
          $$("#incorrecto").html("La contraseña es Incorrecta");
          console.log("contraseña incorrecta");
        }
      
        if(errorCode=="auth/user-not-found"){
          $$("#incorrecto").html("El usuario no corresponde");
          console.log("Usuario incorrecto");
        }
        if(errorCode=="auth/invalid-email"){
          $$("#incorrecto").html("El usuario no corresponde");
          console.log("Usuario incorrecto");
        }
    });
}
function fnqr(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {
        console.log("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
    },
    function (error) {
        console.log("Scanning failed: " + error);
    },
    {
        preferFrontCamera : true, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: true, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt : "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
    }
 );
}