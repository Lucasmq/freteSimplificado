
$(function() {
    $("#cep-destino").mask("99.999-999");

    $("body").on("click","#calcular", async () => {
        let cep = $("#cep-destino").val();
        let lista = await axios.get("https://melhorenvio.com.br/api/v2/calculator?from=58057133&to="+ cep + parseCaixaDimensoes() + "&insurance_value="+ valorTotalSabonetes() +"&services=1,2,15,16,17,23,24")
        console.log(lista);
        preencherTabela(lista.data);
    })
});

function preencherTabela(lista) {

    let json = lista;

    console.log(json)

    jQuery("#tabela > tbody").empty();

    let conteudo = "";

    json.sort(function(a,b) {
        if(a.error) return 1;
        if(b.error) return -1;
        if(a.custom_price > b.custom_price) return -1;
        if(a.custom_price < b.custom_price) return 1;
        return 1;
    })

    for (let i = 0; i < json.length; i++) {
              
        conteudo += "<tr>";
        
        conteudo += "<td><img src='"+ json[i].company.picture +"' alt='"+json[i].company.name+"'></td>";

        if(json[i].error) {
            conteudo += "<td class='rowspan2'>" + json[i].error + "</td>";
            conteudo += "<td></td>";
        } else {
            conteudo += `<td> <div class='descricao-frete'><p>${json[i].name}</p><p>${json[i].delivery_range.min} - ${json[i].delivery_range.max} dias úteis</p></div></td>`;
            conteudo += "<td class='valor-modalidade'>" + json[i].currency + " " + json[i].custom_price + "</td>";
        }
       
        conteudo += "</tr>";
    }
    jQuery("#tabela > tbody").append(conteudo);
		
}

function parseCaixaDimensoes(){
    let caixa = {with: 0, weight:0, height : 0, length:0};
    let totalSab =  $("#quantidade-sabonetes").val();
    let pesoSabonetes = (totalSab * 63.65)/1000;   // PESO
    // X Y Z equivale as 3 dimensÃµes da caixa, em que nesse caso o sabonete equivale a 1 de volume
    // Ex 2 sabonetes serÃ¡ X = 2, Y = 1, Z = 1
    let x = 1, y = 1, z = 1;
    
    caixa.weight = pesoSabonetes;

    if(totalSab < 5) {
        caixa.with = 4;
        caixa.length = 15;
        caixa.height = 16;
    } else {
        let qtdSabAdd = 0;
        // Algoritmo para calcular o tamanho da caixa com sabonetes
        for(let i = 0; i < totalSab; i++) {
            if(x==y && y==z && x*y*z == qtdSabAdd) {
                x++;
            } else if (x > y && x*y*z == qtdSabAdd) {
                y++;
            } else if(x*y*z == qtdSabAdd && (x==y) && z !== x) {
                z++;
            }
            qtdSabAdd++;
        }

        caixa.with = Math.ceil(z*2) + 1;
        caixa.length = Math.ceil(x*6.5) + 1;
        caixa.height = Math.ceil(y*6.5) + 1;
    }

    let dimensoes = `&width=${caixa.with}&weight=${caixa.weight.toString().replace('.',',')}&height=${caixa.height}&length=${caixa.length}`;
    return dimensoes;
}

function valorTotalSabonetes() {
    let quantidadeTotal = $("#quantidade-sabonetes").val();

    return quantidadeTotal * 14;
}
