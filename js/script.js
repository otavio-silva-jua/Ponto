$(document).ready(function () {
    // Função para converter HH:MM em minutos
    function horaParaMinutos(hora) {
        let partes = hora.split(':');
        return parseInt(partes[0]) * 60 + parseInt(partes[1]);
    }

    // Função para converter minutos em HH:MM
    function minutosParaHora(minutos) {
        let horas = Math.floor(minutos / 60);
        let minutosRestantes = minutos % 60;
        return (horas < 10 ? '0' : '') + horas + ':' + (minutosRestantes < 10 ? '0' : '') + minutosRestantes;
    }

    // Restaurar valores salvos na sessão
    if (sessionStorage.getItem('entrada')) {
        $('#um').val(sessionStorage.getItem('entrada'));
    }
    if (sessionStorage.getItem('saidaAlmoco')) {
        $('#dois').val(sessionStorage.getItem('saidaAlmoco'));
    }
    if (sessionStorage.getItem('voltaAlmoco')) {
        $('#tres').val(sessionStorage.getItem('voltaAlmoco'));
    }
    if (sessionStorage.getItem('alertHtml')) {
        $('#area').html(sessionStorage.getItem('alertHtml'));
    }

    $('#calcular').click(function () {
        // Capturar os valores dos campos
        let entrada = $('#um').val();
        let saidaAlmoco = $('#dois').val();
        let voltaAlmoco = $('#tres').val();
        let area = $('#area');

        // Salvar valores na sessão
        sessionStorage.setItem('entrada', entrada);
        sessionStorage.setItem('saidaAlmoco', saidaAlmoco);
        sessionStorage.setItem('voltaAlmoco', voltaAlmoco);

        // Converter horários para minutos
        let minutosEntrada = horaParaMinutos(entrada);
        let minutosSaidaAlmoco = horaParaMinutos(saidaAlmoco);
        let minutosVoltaAlmoco = horaParaMinutos(voltaAlmoco);

        // Calcular a diferença entre saída para almoço e entrada
        let minutosTrabalhadosAntesAlmoco = minutosSaidaAlmoco - minutosEntrada;

        // Definir o total de minutos a serem trabalhados (6 horas)
        let minutosTrabalhoTotal = 6 * 60;

        // Calcular o tempo restante após o almoço
        let minutosRestantes = minutosTrabalhoTotal - minutosTrabalhadosAntesAlmoco;

        // Determinar o horário de saída adicionando o tempo restante ao horário de volta do almoço
        let minutosSaida = minutosVoltaAlmoco + minutosRestantes;

        if (minutosSaida >= 1440) {
            minutosSaida -= 1440; // Ajustar para o horário do próximo dia
        }

        // Calcular o total de horas e minutos trabalhados
        let totalMinutosTrabalhados = minutosTrabalhadosAntesAlmoco + minutosRestantes;
        let horasTrabalhadas = Math.floor(totalMinutosTrabalhados / 60);
        let minutosTrabalhados = totalMinutosTrabalhados % 60;

        // Converter minutos de saída para horário
        let horarioSaida = minutosParaHora(minutosSaida);

        // Exibir resultado
        let html = `
            <div class="alert alert-warning fade show align-items-center d-flex flex-wrap justify-content-between align-content-center" role="alert">
                <div>
                    Horas trabalhadas <strong>${minutosParaHora(minutosTrabalhadosAntesAlmoco)}</strong> <br>
                    Horário de bater o ponto <strong>${horarioSaida}</strong>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        $(area).html(html);
        sessionStorage.setItem('alertHtml', html);
    });
});