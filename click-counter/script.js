const clickBtn = document.getElementById("clickBtn");
const clickCount = document.getElementById("clickCount");

clickBtn.addEventListener("click", function() {
    fetch("/click", {
        method: "POST"
    }).then(function(response) {
        return response.text();
    }).then(function(data) {
        clickCount.textContent = data;
    });
});
