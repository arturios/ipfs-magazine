document.title = datos.titulo;
document.getElementById('portada').href = datos.portada;
document.getElementById('indice').href = datos.indice;
document.getElementById('acerca').href = datos.acerca;

const ipfs_gateways = ["https://ipfs.io/ipfs/", "https://dweb.link/ipfs/", "https://gateway.ipfs.io/ipfs/", "https://ipfs.infura.io/ipfs/", "https://infura-ipfs.io/ipfs/", "https://ipfs.eternum.io/ipfs/", "https://hardbin.com/ipfs/", "https://cloudflare-ipfs.com/ipfs/", "https://astyanax.io/ipfs/", "https://gateway.originprotocol.com/ipfs/", "https://gateway.pinata.cloud/ipfs/", "https://jorropo.net/ipfs/", "https://ipfs.trusti.id/ipfs/", "https://ipfs.telos.miami/ipfs/", "https://robotizing.net/ipfs/", "https://ipfs.fleek.co/ipfs/", "https://ipfs.azurewebsites.net/ipfs/", "https://ipfs.mihir.ch/ipfs/", "https://crustwebsites.net/ipfs/", "https://ipfs.eth.aragon.network/ipfs/", "https://video.oneloveipfs.com/ipfs/", "https://ipfs.decoo.io/ipfs/", "https://hub.textile.io/ipfs/", "https://ravencoinipfs-gateway.com/ipfs/", "https://ipfs.adatools.io/ipfs/", "https://ipfs.kaleido.art/ipfs/", "https://storry.tv/ipfs/", "https://ipfs.kxv.io/ipfs/", "https://ipfs.1-2.dev/ipfs/", "https://ipfs.tribecap.co/ipfs/"]; //lista de gateways ipfs
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 3000);




var cid = getCID(); //recoge el cid que aparece en la página, si no hay coge el de la portada
load_page(cid, 0);

function load_page(cid, n) {
    var articulo = document.getElementById('articulo');
    gateway = ipfs_gateways[n]; //selecciona un gateway según n
    console.log(gateway);
    var url = gateway + cid; //construye la url
    articulo.classList.add('visible'); // a "artículo" le añadimos un bonito "loader" que indique está trabajando

    fetch(url, {
        signal: controller.signal
    }).then(function (response) {
        return response.text();
    }).then(function (html) {
        // una vez obtenido el fichero, incrustamos su código en artículo para que lo pinte y quitamos el "loader"
        html = html.replaceAll("ipfs://", gateway); //reemplaza ipfs:// por el que gateway que corresponda
        html = html.replaceAll("<script", "<!--script");
        html = html.replaceAll("script>", "script -->"); //forma rudimentaria de evitar scripts no deseados
        articulo.innerHTML = html; // en artículo le pone el contenido del fichero descargado
        articulo.classList.remove('visible'); //quita el loader
    }).catch(function (err) {
        // si da error pasa al siguiente gateway hasta terminar los de la lista
        n = n + 1;
        if (n > ipfs_gateways.length) {
            console.error(err);
        } else {
            load_page(cid, n + 1);
        };
    });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getCID() {
    //recogemos la variable cid=loquesea
    cid = getUrlVars()["cid"];
    // si es nula tomamos como variable por defecto la que se define en el logo (así sólo la ponemos una vez)
    if (cid == null) {
        cid = datos.portada;
        cid = cid.substr(cid.length - 46, 46);
    };
    return cid;
};
