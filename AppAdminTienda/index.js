// Initialize Firebase
var config = {
  apiKey: "AIzaSyDH8LCVGBJ7C1OfRmcaa3dvlxin3gH0OEg",
  authDomain: "administracion-tienda.firebaseapp.com",
  databaseURL: "https://administracion-tienda.firebaseio.com",
  projectId: "administracion-tienda",
  storageBucket: "administracion-tienda.appspot.com",
  messagingSenderId: "271437402233"
};
firebase.initializeApp(config);

//0. Autenticar usuarios
 var login = function(){
  var email = document.getElementById("correo").value;
  var password = document.getElementById("pass").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(){
    console.log("Estoy autenticado");
    window.location ="agregarPlatos.html";


  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("error en la auth:"+ errorCode +" "+errorMessage);
    // ...
  });
}

// Observador del usuario autenticado
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.


  } else {
    // No user is signed in.
      console.log("NO AUTORIZADO");
      if(window.location.pathname !== "/index.html"){
        window.location = "index.html";
      }
  }
});

// Logout
 var logout = function(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Sesion Terminada");
  }).catch(function(error) {
    // An error happened.
    console.log("Error en terminar sesion:"+error);
  });
 }


// 1. Crear Platillos

var database = firebase.database(); //referencia de la db

var escribirPlatillo = function(nombre, descripcion, precio,imagen){
  database.ref('alimentos/').push({nombre:nombre,
    descripcion:descripcion,
    precio:precio,
    cantidad:0,
    imagen:imagen}).then(function(){
      //alert("Plato agregado a la base de datos");
      window.location = "agregarPlatos.html";
    }).catch(function(error){
      alert("No se pudo agregar plato"+error);
    });
}

//2. Leer Platillos
var imprimirPlatos = function(){
  var query = database.ref('alimentos/');
  query.once("value", function(snapshot){
    var ul = document.getElementById("lista");

    // console.log(snapshot.val());
    // Esto hace que se borre la lista anterior si tiene elementos
    while(ul.firstChild) ul.removeChild(ul.firstChild);

     snapshot.forEach(function(childSnapshot){
       console.log(childSnapshot.key);
       console.log(childSnapshot.val());
       var childKey = childSnapshot.key;
       var childData = childSnapshot.val();

       var li = document.createElement("li");
       var div = document.createElement("div");
       var img = document.createElement("img");

      var button = document.createElement("button");
      button.setAttribute("id", childKey);
      button.setAttribute("class","btn btn-danger");
      button.setAttribute("onClick", "eliminarPlato(this.id)");
      button.appendChild(document.createTextNode("Eliminar Plato"));


       img.src = childData.imagen;
       img.height =100;
       img.alt = "Imagen del Plato";

       div.appendChild(img);
       div.style.float="right";
       li.setAttribute("class","list-group-item");
       li.setAttribute("id","'"+ childKey + "'");
       li.appendChild(div);
       li.appendChild(document.createTextNode("Nombre: " + childData.nombre));
       li.appendChild(document.createElement("br"));
       li.appendChild(document.createTextNode("Descripcion: " + childData.descripcion));
       li.appendChild(document.createElement("br"));
       li.appendChild(document.createTextNode("Precio: " + childData.precio));
       li.appendChild(document.createElement("br"));
       li.appendChild(button);

       ul.appendChild(li);
     })
  })
}

//3. Eliminar nuestros platillos

var eliminarPlato = function(id){
    database.ref('alimentos/' + id).remove()
    .then(function(){
      //alert("Se elimino el plato")
      console.log("eliminado");
      var ul = document.getElementById("lista");
      var li = document.getElementById("'" + id + "'");
      ul.removeChild(li);
      //window.location = "platos.html";
    })
    .catch(function(error){
      console.log("No se borro el platillo: "+error);
    })
}

function funcionForm(event){
    event.preventDefault();
    var nombre= document.getElementById("nombre").value;
    var descripcion= document.getElementById("descripcion").value;
    var precio= document.getElementById("precio").value;
    var imagen = document.getElementById("imgDir").value;
    //alert(nombre+descripcion+precio);
    escribirPlatillo(nombre,descripcion,precio,imagen);

    return false;
}

// Visualizar Imagen

var storage =firebase.storage();
var storageRef = storage.ref();

function visualizarArchivo(){
  var preview = document.querySelector('img');
  var archivo = document.querySelector('input[type=file]').files[0] //trae primer input de tipo file
  var lector = new FileReader();

  lector.onloadend = function(){
    preview.src=lector.result;
  }

  if(archivo){
    lector.readAsDataURL(archivo);
    var subirImagen = storageRef.child('platillos/'+ archivo.name).put(archivo) //sube el archivo en la carpeta platillos
    subirImagen.on('state_changed', function(snapshot){
      // Indica los cambios de la carga de nuestro archivo
    }, function(error){
       console.log("Error en la carga de la imagen: " + error);
    }, function(){// cuando se completa la carga exitosamente
       console.log(subirImagen.snapshot.downloadURL);
      document.getElementById("imgDir").value =subirImagen.snapshot.downloadURL;
    })
  }
  else{
    preview.src="";
  }

}

// BEBIDAS //
function visualizarArchivoBebidas(){
  var preview = document.querySelector('img');
  var archivo = document.querySelector('input[type=file]').files[0] //trae primer input de tipo file
  var lector = new FileReader();

  lector.onloadend = function(){
    preview.src=lector.result;
  }

  if(archivo){
    lector.readAsDataURL(archivo);
    var subirImagen = storageRef.child('bebidas/'+ archivo.name).put(archivo) //sube el archivo en la carpeta platillos
    subirImagen.on('state_changed', function(snapshot){
      // Indica los cambios de la carga de nuestro archivo
    }, function(error){
       console.log("Error en la carga de la imagen: " + error);
    }, function(){// cuando se completa la carga exitosamente
       console.log(subirImagen.snapshot.downloadURL);
      document.getElementById("imgDir").value =subirImagen.snapshot.downloadURL;
    })
  }
  else{
    preview.src="";
  }
}

function funcionFormBebidas(event){
  event.preventDefault();
  var nombre= document.getElementById("nombre").value;
  var descripcion= document.getElementById("descripcion").value;
  var precio= document.getElementById("precio").value;
  var imagen = document.getElementById("imgDir").value;
  //alert(nombre+descripcion+precio);
  escribirBebida(nombre,descripcion,precio,imagen);

  return false;
}

// escribir bebida
var escribirBebida = function(nombre, descripcion, precio,imagen){
  database.ref('bebidas/').push({nombre:nombre,
    descripcion:descripcion,
    precio:precio,
    cantidad:0,
    imagen:imagen}).then(function(){
      //alert("Bebida agregada a la base de datos");
      window.location = "agregarBebidas.html";
    }).catch(function(error){
      alert("No se pudo agregar plato"+error);
    });
}

// leer bebidas

//2. Leer Platillos
var imprimirBebidas = function(){
  var query = database.ref('bebidas/');
  query.on("value", function(snapshot){
    var ul = document.getElementById("lista");
    // console.log(snapshot.val());
    // Esto hace que se borre la lista anterior si tiene elementos
    while(ul.firstChild) ul.removeChild(ul.firstChild);
     snapshot.forEach(function(childSnapshot){
       console.log(childSnapshot.key);
       console.log(childSnapshot.val());
       var childKey = childSnapshot.key;
       var childData = childSnapshot.val();

       var li = document.createElement("li");
       var div = document.createElement("div");
       var img = document.createElement("img");

      var button = document.createElement("button");
      button.setAttribute("id", childKey);
      button.setAttribute("onClick", "eliminarBebida(this.id)");
      button.appendChild(document.createTextNode("Eliminar Bebida"));
      button.setAttribute("class","btn btn-danger");

       img.src = childData.imagen;
       img.height =100;
       img.alt = "Imagen Bebida";

       div.appendChild(img);
       div.style.float="right";
       li.setAttribute("class","list-group-item");
       li.appendChild(div);
       li.appendChild(document.createTextNode("Nombre: " + childData.nombre));
       li.appendChild(document.createElement("br"));
       li.appendChild(document.createTextNode("Descripcion: " + childData.descripcion));
       li.appendChild(document.createElement("br"));
       li.appendChild(document.createTextNode("Precio: " + childData.precio));
       li.appendChild(document.createElement("br"));
       li.appendChild(button);

       ul.appendChild(li);
     })
  })
}

// 3 eliminar bebidas
var eliminarBebida = function(id){
  database.ref('bebidas/' + id).remove()
  .then(function(){
    //alert("Se elimino la bebida")
    console.log("eliminado");
    window.location = "bebidas.html";
  })
  .catch(function(error){
    console.log("No se borro la bebida: "+ error);
  })
}


