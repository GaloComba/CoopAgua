  
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
      {path: '/about2/',     url: 'about2.html'}
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
  crearCategorias();
  $$("#bot1").on("click", fndatos);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    $$("#qr").on("click", fnqr);
    $$("#leer").on("click",fnleer);
})
$$(document).on('page:init', '.page[data-name="about2"]', function (e) {
   mostrardatos();
  $$("#volver").on("click",fnvolver);
})

// funciones

var email="";
var contr="";
var medidor="", estado="";
var db = firebase.firestore();
var colsocio = db.collection("Socios");


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
function crearCategorias() {
  
  console.log("creando categorias");

  dameUnID = "01111";   datos = { direccion: "Santa Fe 1394", Nombre: "Juan Perez", estado:"456", consumo:"0"};
  colsocio.doc(dameUnID).set(datos);

  dameUnID = "01298";   datos = { direccion: "San Martin 543", Nombre: "Cosme Fulanito", estado:"349", consumo:"0"};
  colsocio.doc(dameUnID).set(datos);

  dameUnID = "00231";   datos = { direccion: "9 de Julio 1134", Nombre: "Jorge Montenegro", estado:"1296", consumo:"0"};
  colsocio.doc(dameUnID).set(datos);

  dameUnID = "14350";   datos = { direccion: "Lisandro de la torre 3211", Nombre: "Miguel Fernandez", estado:"3747", consumo:"0" };
  colsocio.doc(dameUnID).set(datos);

  dameUnID = "20405";   datos = { direccion: "Zeballos 57", Nombre: "Walter Velasquez", estado:"3", consumo:"0"};
  colsocio.doc(dameUnID).set(datos);

}
function fnqr(){
  cordova.plugins.barcodeScanner.scan(
    function (result) {
        console.log("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
        console.log($$("#rqr").val());
        $$("#rqr").val(result.text); 
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
function fnleer(){
  medidor=$$("#rqr").val();
  console.log(medidor);
  estad=parseInt($$("#est").val());
  console.log(estado);

  var docRef = db.collection("Socios").doc(medidor);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            est = parseInt(doc.data().estado);
            console.log(est);
            if (estad >= est){
                cons = estad-est;
                var soc = db.collection("Socios").doc(medidor);
                    // Set the "capital" field of the city 'DC'
                    return soc.update({
                        estado: estad,
                        consumo: cons,
                    })
                    .then(() => {
                        console.log("Document successfully updated!");
                        mainView.router.navigate("/about2/");
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
            }
            else{
              console.log("estado mal tomado");
              $$("#incorrecto2").html("EL ESTADO ACTUAL ES MENOR QUE EL ANTERIOR");
            }
            console.log(Nombre);
            $$("#nombre").html(Nombre);
            $$("#direccion").html(direccion);
            $$("#estado").html(estado);
            $$("#consumo").html(consumo);
          
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            $$("#incorrecto2").html("EL NUMERO DE MEDIDOR NO EXISTE");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  
}

function mostrardatos(){
  var docRef = db.collection("Socios").doc(medidor);
  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          console.log(doc.data().Nombre);
          $$("#nombre").html(doc.data().Nombre);
          $$("#direccion").html(doc.data().direccion);
          $$("#estado").html("Estado Actual: "+doc.data().estado);
          $$("#consumo").html("Consumo: "+doc.data().consumo+"m3");
        
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          $$("#incorrecto2").html("EL NUMERO DE MEDIDOR NO EXISTE");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

function fnvolver(){
  mainView.router.navigate("/about/");
}