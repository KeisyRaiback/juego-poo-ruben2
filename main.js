class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.pointsElement = document.getElementById("points");
        this.crearEscenario();
        this.agregarEventos();
    }

    crearEscenario() {
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        this.crearMonedas();
    }

    crearMonedas() {
        for (let i = 0; i < 5; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.checkColisiones();
    }

    checkColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                    this.puntuacion++;
                    this.actualizarPuntuacion();

                    // Si no quedan monedas, crear más
                    if (this.monedas.length === 0) {
                        this.crearMonedas();
                    }
                }
            });
        }, 100);
    }

    actualizarPuntuacion() {
        this.pointsElement.textContent = this.puntuacion;
    }
}

class Personaje {
    constructor() {
        this.x = 50;
        this.y = 310;
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.puedeSaltarEnAire = true;
        this.intervaloGravedad = null;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
        this.cayendo = false;
    }

    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
            this.element.style.transform = "scaleX(1)"; // Mirar a la derecha
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
            this.element.style.transform = "scaleX(-1)"; // Mirar a la izquierda
        } else if (evento.key === "ArrowUp") {
            this.saltar();
        }
        this.actualizarPosicion();
    }

    saltar() {
        if (!this.saltando && (this.puedeSaltarEnAire || !this.cayendo)) {
            if (this.cayendo) {
                this.puedeSaltarEnAire = false;
                clearInterval(this.intervaloGravedad);
                this.intervaloGravedad = null;
                this.cayendo = false;
            }

            this.saltando = true;
            let alturaMaxima = this.y - 160;

            this.intervaloSalto = setInterval(() => {
                if (this.y > alturaMaxima) {
                    this.y -= 10;
                } else {
                    clearInterval(this.intervaloSalto);
                    this.intervaloSalto = null;
                    this.saltando = false;
                    this.caer();
                }
                this.actualizarPosicion();
            }, 20);
        }
    }

    caer() {
        this.cayendo = true;
        this.intervaloGravedad = setInterval(() => {
            if (this.y < 310) {
                this.y += 10; // Caída más suave
            } else {
                clearInterval(this.intervaloGravedad);
                this.intervaloGravedad = null;
                this.cayendo = false;
                this.puedeSaltarEnAire = true;
                this.y = 310;
                this.actualizarPosicion();
                return;
            }
            this.actualizarPosicion();
        }, 20);
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    colisionaCon(objeto) {
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
        );
    }
}

class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 150 + 50; // Ajustado para que las burbujas aparezcan más arriba
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
        this.animar();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    animar() {
        this.element.style.animation = "girar 1s linear infinite";
    }
}

// Agregar animación CSS para que las burbujas giren
const estilo = document.createElement("style");
estilo.innerHTML = `
    @keyframes girar {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(estilo);

const juego = new Game();
