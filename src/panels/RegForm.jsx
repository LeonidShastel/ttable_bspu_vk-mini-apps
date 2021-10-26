import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Div,
    Button,
    CustomSelectOption,
    FormItem,
    Group,
    Input,
    Panel,
    PanelHeader,
    Select,
    ModalCard, ModalRoot, ScreenSpinner
} from "@vkontakte/vkui";

import infoBSPU from "../components/Base";
import {Icon56NotificationOutline} from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";
import Base from "../components/Base";

const MODAL_ACCEPT_MESSAGES = 'accept_messages'


const RegForm = ({id,setActivePanel ,togglePopout,fetchedUser}) => {
    const [faculty, setFaculty] = useState(null);
    const [group, setGroup] = useState(null);
    const [showModal, setShowModal] = useState(null);


    useEffect(()=>{
        console.log(fetchedUser);
    },[fetchedUser])

    const saveUser = () =>{
        setShowModal(null);
        togglePopout(true);
        bridge.send("VKWebAppGetCommunityToken", {"app_id": 7984065, "group_id": 208234280, "scope": "messages"})
            .then(response=>{
                console.log(response)
                if(response.access_token){
                    const data = {
                        'name': fetchedUser.first_name+' '+fetchedUser.last_name,
                        'id':fetchedUser.id,
                        'faculty':faculty,
                        'group':group,
                        'access_token':response.access_token,
                    }
                    let config = {
                        headers: {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*',
                        }
                    }

                    axios.post('https://thelaxab.ru/timetable/add_user.php',data,config)
                        .then(response=>console.log(response.data))


                    bridge.send("VKWebAppStorageSet", {"key": 'faculty', "value": ''+Base[faculty].fuc_id})
                        .then(response=>console.log(response))
                    bridge.send("VKWebAppStorageSet", {"key": 'group', "value": ''+Base[faculty].groups[group].group_id})
                        .then(response=>console.log(response))

                }
            })
            .then((res)=>{
                togglePopout(false);
                setActivePanel('home');
            })
    }

    return (
        <Panel id={id}>
            <PanelHeader>Регистрация</PanelHeader>
            <Group>
                <FormItem top='Факультет'>
                    <Select placeholder='Не выбран'
                        options={infoBSPU.map((fac,index)=>({label:fac.name, value:index}))}
                            onChange={(e)=>{
                                setFaculty(e.target.value)
                            }}
                            renderOption={({option,...restProps})=>(
                                <CustomSelectOption {...restProps}/>
                            )}
                    />
                </FormItem>
                <FormItem top='Группа'>
                    {
                        faculty!==null ?
                        <Select placeholder='Не выбран'
                                options={infoBSPU[faculty].groups.map((group,index)=>({label:group.name, value:index}))}
                                onChange={(e)=>setGroup(e.target.value)}
                                renderOption={({option,...restProps})=>(
                                    <CustomSelectOption {...restProps}/>
                                )}
                        /> :
                            <Select placeholder={'Выберите факультет'}/>
                    }
                </FormItem>
                <Div>
                    <Button mode="primary" size={"l"} onClick={saveUser} disabled={faculty===null || group===null}>Разрешить доступ к сообщениям</Button>
                </Div>
            </Group>

            {/*<ModalRoot activeModal={showModal}>*/}
            {/*    <ModalCard*/}
            {/*        id={MODAL_ACCEPT_MESSAGES}*/}
            {/*        onClose={() => setShowModal(null)}*/}
            {/*        icon={<Icon56NotificationOutline />}*/}
            {/*        header="Приложение запрашивает разрешение на отправку Вам сообщений"*/}
            {/*        actions={[*/}
            {/*            <Button key="deny" size="l" mode="secondary" onClick={() => setShowModal(null)}>*/}
            {/*                Запретить*/}
            {/*            </Button>,*/}
            {/*            <Button key="allow" size="l" mode="primary" onClick={saveUser}>*/}
            {/*                Разрешить*/}
            {/*            </Button>,*/}
            {/*        ]}*/}
            {/*    />*/}
            {/*</ModalRoot>*/}
        </Panel>
    );
};

RegForm.propTypes={
    id:PropTypes.string.isRequired,
    go:PropTypes.func.isRequired,
    togglePopout:PropTypes.func.isRequired,
}

export default RegForm;