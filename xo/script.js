const board = document.getElementById("board");
const cells = board.getElementsByTagName("td");
const winner = document.getElementById("winner");
let currentSymbol = "X";

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() {
        if (this.textContent === "") {
            this.textContent = currentSymbol;
            fetch("/move", {
                method: "POST",
                body: JSON.stringify({ index: i, symbol: currentSymbol }),
                headers: { 'Content-Type': 'application/json' }
            }).then(function(response) {
                return response.text();
            }).then(function(data) {
                if (data !== "None") {
                    winner.textContent = "Победитель: " + data;
                }
                currentSymbol = currentSymbol === "X" ? "O" : "X";
            });
        }
    });
}
