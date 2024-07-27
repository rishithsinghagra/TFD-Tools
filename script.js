document.addEventListener('DOMContentLoaded', function() {
    var hp1 = document.getElementById('hp1');
    var hp2 = document.getElementById('hp2');
    var def1 = document.getElementById('def1');
    var def2 = document.getElementById('def2');
    var hp1calc = document.getElementById('hp1calc');
    var hp2calc = document.getElementById('hp2calc');
    var def1calc = document.getElementById('def1calc');
    var def2calc = document.getElementById('def2calc');

    var comb1result = document.getElementById('comb1result')
    var comb2result = document.getElementById('comb2result')

    hp1.addEventListener('input', updateResult);
    hp2.addEventListener('input', updateResult);
    def1.addEventListener('input', updateResult);
    def2.addEventListener('input', updateResult);

    function updateResult() {
        var hp1val = hp1.value;
        var hp2val = hp2.value;
        var def1val = def1.value;
        var def2val = def2.value;
        if (hp1val && hp2val && def1val && def2val) {
            comb1effective = calculateEffectiveHP(hp1val, def1val);
            comb2effective = calculateEffectiveHP(hp2val, def2val);
            if (comb1effective > comb2effective) {
                comb1id = 'highhp';
                comb2id = 'lowhp';
            } else if (comb1effective < comb2effective) {
                comb1id = 'lowhp';
                comb2id = 'highhp';
            } else {
                comb1id = 'equalhp';
                comb2id = 'equalhp';
            }
            comb1result.innerHTML = `<p class="mainresult">Effective HP: <strong>${comb1effective}</strong> </p>`;
            comb1result.id = comb1id
            comb2result.innerHTML = `<p class="mainresult">Effective HP: <strong>${comb2effective}</strong> </p>`;
            comb2result.id = comb2id
        } else if (hp1val && def1val) {
            comb1effective = calculateEffectiveHP(hp1val, def1val);
            comb1result.id = 'highhp';
            comb1result.innerHTML = `<p class="mainresult">Effective HP: <strong>${comb1effective}</strong> </p>`;
            comb2result.innerHTML = `<p class="unfilled">Awaiting HP and Defense values.</p>`;
        } else if (hp2val && def2val) {
            comb2effective = calculateEffectiveHP(hp2val, def2val);
            comb2result.id = 'highhp';
            comb1result.innerHTML = `<p class="unfilled">Awaiting HP and Defense values.</p>`;
            comb2result.innerHTML = `<p class="mainresult">Effective HP: <strong>${comb2effective}</strong> </p>`;
        } else {
            comb1result.innerHTML = `<p class="unfilled">Awaiting HP and Defense values.</p>`;
            comb2result.innerHTML = `<p class="unfilled">Awaiting HP and Defense values.</p>`;
        }
        updateButtons(hp1val, hp2val, def1val, def2val);
    }

    function updateButtons(hp1val, hp2val, def1val, def2val) {
        if (hp1val && hp2val && def1val && def2val) {
            hp1calc.disabled = false;
            hp2calc.disabled = false;
            def1calc.disabled = false;
            def2calc.disabled = false;
        } else if (hp1val && def1val && hp2val) {
            hp1calc.disabled = true;
            hp2calc.disabled = true;
            def1calc.disabled = true;
            def2calc.disabled = false;
        } else if (hp1val && def1val && def2val) {
            hp1calc.disabled = true;
            hp2calc.disabled = false;
            def1calc.disabled = true;
            def2calc.disabled = true;
        } else if (hp1val && hp2val && def2val) {
            hp1calc.disabled = true;
            hp2calc.disabled = true;
            def1calc.disabled = false;
            def2calc.disabled = true;
        } else if (def1val && hp2val && def2val) {
            hp1calc.disabled = false;
            hp2calc.disabled = true;
            def1calc.disabled = true;
            def2calc.disabled = true;
        } else {
            hp1calc.disabled = true;
            hp2calc.disabled = true;
            def1calc.disabled = true;
            def2calc.disabled = true;
        }
    }

    updateResult();
});

function defenseToDamageReduction(def) {
    damagereduction = Math.log2(def / 1000) * 10;
    if (damagereduction > 80) {
        damagereduction = 80;
    }
    if (damagereduction < 0) {
        damagereduction = 0;
    }
    return damagereduction;
}

function calculateEffectiveHP(hp, def) {
    damagereduction = defenseToDamageReduction(def);
    damagereceived = 100 - damagereduction;
    effectivehp = Math.round(hp / damagereceived * 100);
    return effectivehp;
}

function calculateHPForEffective(def, effective) {
    damagereduction = defenseToDamageReduction(def);
    damagereceived = 100 - damagereduction;
    requiredhp = effective / 100 * damagereceived;
    return Math.round(requiredhp);
}

function calculateDefForEffective(hp, effective) {
    requireddamagereduction = 100 - hp / effective * 100;
    if (requireddamagereduction >= 0 && requireddamagereduction <= 80) {
        return Math.round(Math.pow(2, requireddamagereduction / 10) * 1000);
    } else {
        alert("An equivalent value is not possible!");
        return hp
    }
}

function calchp1() {
    var hp2val = hp2.value;
    var def1val = def1.value;
    var def2val = def2.value;
    othereffective = calculateEffectiveHP(hp2val, def2val);
    hp1.value = calculateHPForEffective(def1val, othereffective);
    hp1.dispatchEvent(new Event('input'));
}
function calcdef1() {
    var hp1val = hp1.value;
    var hp2val = hp2.value;
    var def2val = def2.value;
    othereffective = calculateEffectiveHP(hp2val, def2val);
    def1.value = calculateDefForEffective(hp1val, othereffective);
    def1.dispatchEvent(new Event('input'));
}
function calchp2() {
    var hp1val = hp1.value;
    var def1val = def1.value;
    var def2val = def2.value;
    othereffective = calculateEffectiveHP(hp1val, def1val);
    hp2.value = calculateHPForEffective(def2val, othereffective);
    hp2.dispatchEvent(new Event('input'));
}
function calcdef2() {
    var hp1val = hp1.value;
    var hp2val = hp2.value;
    var def1val = def1.value;
    othereffective = calculateEffectiveHP(hp1val, def1val);
    def2.value = calculateDefForEffective(hp2val, othereffective);
    def2.dispatchEvent(new Event('input'));
}