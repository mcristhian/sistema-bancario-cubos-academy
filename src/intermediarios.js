const bancodedados = require('./bancodedados')
const { encontrarIndiceConta, encontrarConta } = require('./controladores/contas')

function encontrarPropriedadeDuplicada (cpf, email) {
    const propriedadeDuplicada = bancodedados.contas.some((conta) => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    })

    return propriedadeDuplicada
}

const verificarSenha = (req, res, next) => {
    const { senha } = bancodedados.banco
    const { senha_banco } = req.query
    
    if (senha_banco === senha) {
        next()
    } else {
        res.status(401).json({ mensagem: 'Senha incorreta.' })
    }
}

const verificarPreenchimentoCriarConta = (req, res, next) => {
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Informe todos os dados.' })
    } else {
        next()
    }
}

const verificarPreenchimentoAtualizarUsuario = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Informe um ou mais atributos válidos.' })
    } else {
        next()
    }
}

const verificarPreenchimentoDeposito = (req, res, next) => {
    const { numero_conta, valor } = req.body

    if (numero_conta === undefined || valor === undefined) {
        return res.status(400).json({ mensagem: 'Informe todos os dados.' })
    } else {
        next()
    }
}

const verificarPreenchimentoSaque = (req, res, next) => {
    const { numero_conta, senha, valor } = req.body

    if (numero_conta === undefined || senha === undefined || valor === undefined) {
        return res.status(400).json({ mensagem: 'Informe todos os dados.' })
    } else {
        next()
    }
}

const verificarPreenchimentoTransferencia = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body

    if (numero_conta_origem === undefined || numero_conta_destino === undefined || senha === undefined || valor === undefined) {
        return res.status(400).json({ mensagem: 'Informe todos os dados.' })
    } else {
        next()
    }
}

const verificarPreenchimentoConsulta = (req, res, next) => {
    const { numero_conta, senha } = req.query

    if (numero_conta === undefined || senha === undefined) {
        return res.status(400).json({ mensagem: 'Informe todos os dados.' })
    } else {
        next()
    }
}

const verificarPreenchimentoListarContas = (req, res, next) => {
    const { senha_banco } = req.query

    if (senha_banco === undefined) {
        return res.status(400).json({ mensagem: 'Informe todos os dados.' })
    } else {
        next()
    }
}

const verificarDuplicidadePropriedade = (req, res, next) => {
    const {cpf, email} = req.body
    const propriedadeDuplicada = encontrarPropriedadeDuplicada(cpf, email)

    if (propriedadeDuplicada) {
        return res.status(403).json({ mensagem: 'CPF e/ou email duplicado(s).' })
    } else {
        next()
    }
}

const verificarIndiceConta = (req, res, next) => {
    const { numeroConta } = req.params
    const indiceConta = encontrarIndiceConta(numeroConta)

    if (indiceConta === -1) {
        return res.status(404).json({ mensagem: 'Usuário/conta não encontrado.' })
    } else {
        next()
    }
}

const verificarSaldoConta = (req, res, next) => {
    const { numeroConta } = req.params
    const conta = encontrarConta(numeroConta)

    if (conta.saldo !== 0) {
        return res.status(403).json({ mensagem: 'Conta com saldo.' })
    } else {
        next()
    }
}

const verificarValorZeradoOuNegativo = (req, res, next) => {
    const { valor } = req.body

    if (valor <= 0) {
        return res.status(403).json({ mensagem: 'Valor inválido.' })
    } else {
        next()
    }
}

const verificarConta = (req, res, next) => {
    const { numero_conta } = req.body
    const conta = encontrarConta(numero_conta)

    if (numero_conta === undefined) {
        const { numero_conta_origem, numero_conta_destino } = req.body
        const conta_origem = encontrarConta(numero_conta_origem)
        const conta_destino = encontrarConta(numero_conta_destino)

        if (conta_origem === undefined || conta_destino === undefined) {
            return res.status(404).json({ mensagem: 'Conta(s) não encontrada(s).' })
        } else {
            next()
        }
    } else {
        if (!conta) {
            return res.status(404).json({ mensagem: 'Conta não encontrada.' })
        } else {
            next()
        }
    }
}

const verificarContaOperacao = (req, res, next) => {
    const { numero_conta } = req.query
    const conta = encontrarConta(numero_conta)

    if (conta === undefined) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    } else {
        next()
    }
}

const verificarSenhaConta = (req, res, next) => {
    const { numero_conta, senha } = req.body
    const conta = encontrarConta(numero_conta)

    if (numero_conta === undefined) {
        const { numero_conta_origem, senha } = req.body
        const conta = encontrarConta(numero_conta_origem)

        if (conta.usuario.senha !== senha) {
            res.status(401).json({ mensagem: 'Senha incorreta.' })
        } else {
            next()
        }
    } else {
        if (conta.usuario.senha !== senha) {
            res.status(401).json({ mensagem: 'Senha incorreta.' })
        } else {
            next()
        }
    }
}

const verificarSenhaOperacao = (req, res, next) => {
    const { numero_conta, senha } = req.query
    const conta = encontrarConta(numero_conta)

    if (conta.usuario.senha !== senha) {
        res.status(401).json({ mensagem: 'Senha incorreta.' })
    } else {
        next()
    }
}

const verificarSaldoOperacao = (req, res, next) => {
    const { numero_conta } = req.body
    let { valor } = req.body
    valor = Number(valor)

    if (numero_conta !== undefined) {
        const conta = encontrarConta(numero_conta)
    
        if (conta.saldo < valor) {
            return res.status(403).json({ mensagem: 'Saldo insuficiente.' })
        } else {
            next()
        }
    } else {
        const { numero_conta_origem } = req.body
        const conta = encontrarConta(numero_conta_origem)

        if (conta.saldo < valor) {
            return res.status(403).json({ mensagem: 'Saldo insuficiente.' })
        } else {
            next()
        }
    }
}

module.exports = {
    verificarSenha,
    verificarSenhaConta,
    verificarPreenchimentoCriarConta,
    verificarPreenchimentoAtualizarUsuario,
    verificarPreenchimentoDeposito,
    verificarPreenchimentoSaque,
    verificarPreenchimentoConsulta,
    verificarPreenchimentoListarContas,
    verificarDuplicidadePropriedade,
    verificarIndiceConta,
    verificarSaldoConta,
    verificarValorZeradoOuNegativo,
    verificarConta,
    verificarContaOperacao,
    verificarSenhaConta,
    verificarSenhaOperacao,
    verificarSaldoOperacao,
    verificarPreenchimentoTransferencia
}
