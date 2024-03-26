const wordDisplay = document.querySelector(".word-display"); // Kelime
const guessesText = document.querySelector(".guesses-text b"); // Tahmin sayısını 
const keyboardDiv = document.querySelector(".keyboard"); // Klavye butonlarının bulunduğu bölüm
const hangmanImage = document.querySelector(".hangman-box img"); // Asma tablosu
const gameModal = document.querySelector(".game-modal"); // iletişim kutusu
const playAgainBtn = gameModal.querySelector(".play-again"); // Yeniden oyna butonu
const gameModal2 = document.querySelector(".game-modal2"); // iletişim kutusu
const playAgainBtn2 = gameModal2.querySelector(".play-again2"); //
const gameBox=document.querySelector(".game-box"); // oyun kutusu
const nextBtn=gameBox.querySelector(".next"); //next buttonu

// Oyun değişkenlerini başlatıyoruz
let currentWord, correctLetters, wrongGuessCount; // Şu anki kelime, doğru harfler ve yanlış tahmin sayısı değişkenleri
const maxGuesses = 6; // Maksimum yanlış tahmin sayısı

// Oyunu sıfırlayan fonksiyon
const resetGame = () => {
    correctLetters = []; // Doğru harflerin listesi
    wrongGuessCount = 0; // Yanlış tahmin sayısı
    hangmanImage.src = "images/hangman-0.svg"; // Asma tablosunun ilk durumunu gösteren görüntü
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Tahmin sayısını gösteren metin
    // Kelimeyi gösteren HTML içeriğini sıfırlıyoruz
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join(""); 
    // Klavye butonlarını etkinleştiriyoruz
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    // Oyun sonu iletişim kutusunu gizliyoruz
    gameModal.classList.remove("show");
}

//soru atlamak için
let skipCount = 0; // Atlama hakkı sayacı

// "Next" butonuna tıklandığında çağrılacak fonksiyon
const onNextButtonClick = () => {
        // Atlama hakkı sayısı kontrolü
        if (skipCount < 3) {
            // Oyunu kaybetmiş gibi davranarak doğru tahmin edilmemiş harfleri göster
            currentWord.split('').forEach((letter, index) => {
                if (!correctLetters.includes(letter)) {
                    wordDisplay.querySelectorAll('li')[index].innerText = letter;
                    wordDisplay.querySelectorAll('li')[index].classList.add('guessed');
                }
                
            });
            getRandomWord();
            skipCount++; // Atlama hakkı sayacını arttır
            console.log(skipCount);
        } else {
            // Oyunu bitirme durumunu tetikle
            gameModal2.classList.add("show");
            playAgainBtn2.addEventListener("click", () => {
                gameModal2.classList.remove("show"); // gameModal2'nin görünürlüğünü kaldır
                getRandomWord(); // Yeni kelimeyi al
            });
            
            skipCount = 0;
        } 
};
nextBtn.addEventListener('click', onNextButtonClick);

// Rastgele bir kelime seçen fonksiyon
const getRandomWord = () => {
    // Rastgele bir soru ve ipucu seçiyoruz
    const { word, hint } = soruListesi[Math.floor(Math.random() * soruListesi.length)];
    currentWord = word; // Seçilen kelimeyi kaydediyoruz
    document.querySelector(".hint-text b").innerText = hint; // İpucunu gösteriyoruz
    resetGame(); // Oyunu sıfırlıyoruz
}

// Oyunun bitişini kontrol eden fonksiyon
const gameOver = (isVictory) => {
    const modalText = isVictory ? `Kelimeyi buldunuz:` : 'Doğru kelime:';
    // Doğru veya yanlış sonuca göre iletişim kutusunu güncelliyoruz
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Tebrikler!' : 'Bilemediniz!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show"); // İletişim kutusunu gösteriyoruz
}

// Oyunu başlatan fonksiyon
const initGame = (button, clickedLetter) => {
    // Kullanıcının seçtiği harf kelime içerisinde var mı kontrol ediliyor
    if(currentWord.includes(clickedLetter)) {
        // Doğru tahmin edilen harfleri gösteriyoruz
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter); // Doğru harfi listeye ekliyoruz
                wordDisplay.querySelectorAll("li")[index].innerText = letter; // Doğru harfi gösteriyoruz
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed"); // Doğru harfi işaretliyoruz
            }
        });
    } else {
        // Yanlış tahmin edilen harf sayısını arttırıyoruz ve asma tablosunun durumunu güncelliyoruz
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Tıklanan butonu etkisiz hale getiriyoruz
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Tahmin sayısını güncelliyoruz

    // Oyunun sonunu kontrol ediyoruz
    if(wrongGuessCount === maxGuesses) return gameOver(false); // Eğer maksimum yanlış tahmin sayısına ulaşıldıysa oyunu bitir
    if(correctLetters.length === currentWord.length) return gameOver(true); // Eğer tüm harfler doğru tahmin edildiyse oyunu bitir
}

// klavye oluşturmak için
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'ğ', 'h', 'ı', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z', 'ç'];

letters.forEach(letter => {
    const button = document.createElement("button"); // Buton oluşturmak için
    button.innerText = letter; // Butonun harfini belirlemek için
    keyboardDiv.appendChild(button); // Butonu klavye bölümüne eklemek için
    button.addEventListener("click", (e) => initGame(e.target, letter)); // Butona tıklandığında oyunu başlatan fonksiyonu bağlamak için
});
getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
