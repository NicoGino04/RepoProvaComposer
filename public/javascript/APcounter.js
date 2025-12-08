document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(card => {
        const countEl = card.querySelector('.count');
        const btnInc = card.querySelector('.increase');
        const btnDec = card.querySelector('.decrease');
        const btnSave = card.querySelector('.save-btn');

        if (!countEl || !btnInc || !btnDec) return;

        let count = 0;

        btnInc.addEventListener('click', () => {
            count++;
            countEl.textContent = count;
        });

        btnDec.addEventListener('click', () => {
            if (count > 0) count--;
            countEl.textContent = count;
        });

        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const parametro = card.querySelector('h3').textContent;
                const payload = { parametro, valore: count };
                console.log("Simulazione invio al DB:", payload);
                alert(`Salvato: ${parametro} = ${count}`);
            });
        }
    });
});