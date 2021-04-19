/*
 * 2C = Two of Clubs
 * 2D = Two of diamonds
 * 2H = Two of hearts
 * 2S = Two of Spades
 */

const myModule = (() => {
    "use strict";

    let deck = [];
    const tipos = ["C", "D", "H", "S"],
        especiales = ["A", "J", "Q", "K"];

    let puntosJugadores = [];

    const btnPedir = document.querySelector("#btnPedir"),
        btnNuevo = document.querySelector("#btnNuevo"),
        bntDetener = document.querySelector("#btnDetener");

    const scores = document.querySelectorAll("small"),
        tableros = document.querySelectorAll(".div-cartas");

    // Esta funicion inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        tableros.forEach((tablero) => (tablero.innerHTML = ""));
        scores.forEach((score) => (score.innerText = "0"));

        btnPedir.disabled = false;
        bntDetener.disabled = false;
    };

    const crearDeck = () => {
        deck = [];

        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }
        }

        return _.shuffle(deck);
    };

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw "No hay cartas en el deck";
        }

        return deck.pop();
    };

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
    };

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/img/${carta}.png`;
        imgCarta.classList.add("carta");
        tableros[turno].append(imgCarta);
    };

    const determinarGanador = () => {
        const [puntosMinimos, puntosPC] = puntosJugadores;

        setTimeout(() => {
            if (
                puntosPC === puntosMinimos ||
                (puntosPC < 21 && puntosMinimos < 21) ||
                (puntosPC < 21 && puntosMinimos < 21)
            ) {
                alert("Nadie gana");
            } else if (puntosMinimos > 21 || puntosPC === 21) {
                alert("La computadora gana");
            } else if (puntosPC > 21) {
                alert("Jugador gana");
            }
        }, 100);
    };

    //Turno: 0 = primer jugador y el ultimo sera la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        scores[turno].innerText = puntosJugadores[turno];
        crearCarta(carta, turno);

        return puntosJugadores[turno];
    };

    // Computadora
    const turnoComputadora = (puntosMinimos) => {
        const turnoPC = puntosJugadores.length - 1;
        let puntosPC = 0;

        do {
            const carta = pedirCarta();
            acumularPuntos(carta, turnoPC);
            puntosPC = puntosJugadores[turnoPC];

            if (puntosMinimos > 21) {
                break;
            }
        } while (puntosPC < puntosMinimos && puntosMinimos <= 21);

        determinarGanador();
    };

    // Eventos
    btnPedir.addEventListener("click", () => {
        const carta = pedirCarta(); //Get a card from the deck.
        acumularPuntos(carta, 0);

        if (puntosJugadores[0] > 21) {
            btnPedir.disabled = true;
            bntDetener.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        } else if (puntosJugadores[0] === 21) {
            bntDetener.disabled = true;
            btnPedir.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        }
    });

    bntDetener.addEventListener("click", () => {
        btnPedir.disabled = true;
        bntDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener("click", () => {
        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego,
    };
})();
