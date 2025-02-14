class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.estrellas = [];
        this.puntuacion = 0;
        this.pointsElement = document.getElementById("points");
        this.sonidoColision = new Audio('./audio/sonido-mario.mp3'); // Asegúrate de tener este archivo de sonido
        this.crearEscenario();
        this.agregarEventos();
    }

    crearEscenario() {
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        this.crearEstrellas();
    }

    crearEstrellas() {
        for (let i = 0; i < 5; i++) {
            const estrella = new Estrella();
            this.estrellas.push(estrella);
            this.container.appendChild(estrella.element);
        }
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.checkColisiones();
    }

    checkColisiones() {
        setInterval(() => {
            this.estrellas.forEach((estrella, index) => {
                if (this.personaje.colisionaCon(estrella)) {
                    this.container.removeChild(estrella.element);
                    this.estrellas.splice(index, 1);
                    this.sonidoColision.play(); // Reproduce el sonido al colisionar
                    this.puntuacion++;
                    this.actualizarPuntuacion();

                    // Si no quedan estrellas, crear más
                    if (this.estrellas.length === 0) {
                        this.crearEstrellas();
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

class Estrella {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 150 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("estrella");
        this.actualizarPosicion();
        this.animar();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    animar() {
        this.element.style.animation = "girarEstrella 1s linear infinite";
    }
}

// Agregar animación CSS para que las estrellas giren
const estilo = document.createElement("style");
estilo.innerHTML = `
    @keyframes girarEstrella {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }
`;
document.head.appendChild(estilo);

const juego = new Game();
