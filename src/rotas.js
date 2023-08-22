const express = require('express')
const { listarContas, criarConta, atualizarUsuario, excluirConta, depositar, sacar, transferir, consultarSaldo, gerarExtrato } = require('./controladores/contas')
const { verificarSenha, verificarPreenchimentoCriarConta, verificarPreenchimentoAtualizarUsuario, verificarDuplicidadePropriedade, verificarIndiceConta, verificarSaldoConta, verificarPreenchimentoDeposito, verificarValorZeradoOuNegativo, verificarConta, verificarSenhaConta, verificarPreenchimentoSaque, verificarSaldoOperacao, verificarPreenchimentoTransferencia, verificarPreenchimentoConsulta, verificarSenhaOperacao, verificarContaOperacao, verificarPreenchimentoListarContas } = require('./intermediarios')
const rotas = express()

rotas.get('/contas', verificarPreenchimentoListarContas, verificarSenha, listarContas)
rotas.post('/contas', verificarPreenchimentoCriarConta, verificarDuplicidadePropriedade, criarConta)
rotas.put('/contas/:numeroConta/usuario', verificarPreenchimentoAtualizarUsuario, verificarIndiceConta, verificarDuplicidadePropriedade,atualizarUsuario)
rotas.delete('/contas/:numeroConta', verificarIndiceConta, verificarSaldoConta, excluirConta)

rotas.post('/transacoes/depositar', verificarPreenchimentoDeposito, verificarValorZeradoOuNegativo, verificarConta, depositar)
rotas.post('/transacoes/sacar', verificarPreenchimentoSaque, verificarValorZeradoOuNegativo, verificarConta, verificarSenhaConta, verificarSaldoOperacao, sacar)
rotas.post('/transacoes/transferir', verificarPreenchimentoTransferencia, verificarValorZeradoOuNegativo, verificarConta, verificarSenhaConta, verificarSaldoOperacao, transferir)

rotas.get('/contas/saldo', verificarPreenchimentoConsulta, verificarContaOperacao, verificarSenhaOperacao, consultarSaldo)
rotas.get('/contas/extrato', verificarPreenchimentoConsulta, verificarContaOperacao, verificarSenhaOperacao, gerarExtrato)

module.exports = {
    rotas
}
