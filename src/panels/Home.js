import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import Base from "../components/Base";

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";

const Home = ({ id, go, fetchedUser, dataInfo,setActivePanel}) => {
	useEffect(()=>{console.log(fetchedUser)},[fetchedUser]);
	const [currentFaculty, setCurrentFaculty] = useState(null);
	const [currentGroup, setCurrentGroup] = useState(null);

	useEffect(()=>{
		console.log(dataInfo)
		if(dataInfo){
			Base.map((fac,index)=>{
				if(fac.fuc_id===+dataInfo.faculty){
					setCurrentFaculty(fac.name)
					Base[index].groups.map(group=>{
						if(group.group_id===+dataInfo.group){
							setCurrentGroup(group.name)
						}
					})
				}
			})
		}
		console.log(currentFaculty,currentGroup)
	},[dataInfo])

	const dataReset = () =>{
		let config = {
			headers: {
				"Content-Type": "application/json",
				'Access-Control-Allow-Origin': '*',
			}
		}

		axios.get(`https://thelaxab.ru/timetable/delete_user.php?id=${fetchedUser.id}`,config)
			.then(response=>console.log(response.data))

		bridge.send("VKWebAppStorageSet", {"key": 'faculty', "value": ''})
			.then(response=>console.log(response))
		bridge.send("VKWebAppStorageSet", {"key": 'group', "value": ''})
			.then(response=>console.log(response))
		setActivePanel('reg');
	}

	return (
		<Panel id={id}>
			<PanelHeader>Информация о пользователе</PanelHeader>
			{fetchedUser && currentFaculty && currentGroup &&
			<Group header={<Header mode="secondary">Информация по которой приходят сообщения</Header>}>
				<Cell
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</Cell>
				<Cell>
					{`Факультет: ${currentFaculty}`}
				</Cell>
				<Cell>
					{`Группа: ${currentGroup}`}
				</Cell>
				<Cell>
					По этим данных Вам будет ежедневно в 6:30 приходить расписание
				</Cell>
				<Cell>
					<Button size={"m"} onClick={dataReset}>Сбросить данные</Button>
				</Cell>
			</Group>}

		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
