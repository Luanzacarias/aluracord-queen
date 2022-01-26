import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';


export default function ChatPage() {
    
    // useState para manter a mensagem
    const [mensagem, setMensagem] = React.useState('');
    // lista de mensagens
    const [listaMensagens, setListaMensagens] = React.useState([]);

    // função pra enviar as mensagens
    function handleNovaMensage(novaMensagem) {
        //
        const mensagem = {
            id: listaMensagens.length + 1, // utilizando o proprio tamanho da lista pra gerar o id 
            de: 'vanessametonini',
            texto: novaMensagem,
        }

        setListaMensagens([
            // a ordem depende da sua preferência na hr de exibir
            mensagem,
            ...listaMensagens
        ]);
        setMensagem('');
    }

    // função para deletar mensagem da lista
    function handleDeleteMensagem(mensagemAtual) {
        // id da msg
        const id = mensagemAtual.id;
        // lista filtrada
        const messagesListFiltered = listaMensagens.filter((message) => {
            return message.id != id
        })
        setListaMensagens(messagesListFiltered);
    }
    

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://www.wallpapertip.com/wmimgs/69-697483_bohemian-rhapsody-queen-music-movies-bohemian-rhapsody-wallpaper.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaMensagens} handleDeleteMensagem={handleDeleteMensagem}/>
                
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                        }}
                    >
                        
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor)
                            }}
                            // para verificar se o enter vai ser pressionado
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    // retirar o comportamento padrão do enter (quebrar uma linha)
                                    event.preventDefault();
                                    // função pra enviar a msg
                                    handleNovaMensage(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '6px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button 
                            size="lg"
                            variant='primary'
                            colorVariant = 'dark'
                            label={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.neutrals[800],
                                mainColorLight: appConfig.theme.colors.neutrals[900],
                                mainColorStrong: appConfig.theme.colors.neutrals[900],
                            }}
                            styleSheet={{
                                borderRadius:'5px'
                            }}
                            onClick={(event) => {
                                // retirar o comportamento padrão do enter (quebrar uma linha)
                                event.preventDefault();
                                // função pra enviar a msg
                                handleNovaMensage(mensagem);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat - Queen
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label={'Logout'}
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    const handleDeleteMensagem = props.handleDeleteMensagem;

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow:'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                // pra cada item do array ele vai retornar:
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/vanessametonini.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>

                            <Button 
                            /* botão para excluir a mensagem */
                                styleSheet={{
                                    borderRadius: '25%',
                                    width: '12px',
                                    marginLeft: '8px'
                                }}
                                variant='tertiary'
                                colorVariant='dark'
                                label={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>}
                                buttonColors={{
                                    mainColor: appConfig.theme.colors.neutrals['000'],
                                }}
                                // quando clicar vai chamar a função de excluir a mensagem
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleDeleteMensagem(mensagem)
                                }}
                            />

                        </Box>
                        {mensagem.texto}
                    </Text>
                )
            })}

        </Box>
    )
}