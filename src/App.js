import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import RegForm from "./panels/RegForm";

const App = () => {
	const [activePanel, setActivePanel] = useState('reg');
	const [fetchedUser, setUser] = useState(null);
	const [dataInfo, setDataInfo] = useState({});
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);


	useEffect(() => {
		setActivePanel(Object.keys(dataInfo).length>0 ? 'home' : 'reg');
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			bridge.send("VKWebAppStorageGet", {"keys": ["faculty", "group"]})
				.then(response=>{
					console.log(response)
					if(response.keys[0].value!==''&&response.keys[1].value!==''&&response.keys[1].value!=='undefined'&&response.keys[0].value!=='undefined'){
						setDataInfo({
							'faculty':response.keys[0].value,
							'group':response.keys[1].value
						})
						setActivePanel('home');
					}
					else{
						setActivePanel('reg');
					}
				})
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const togglePopout = e =>{
		if(e===true)
			setPopout(<ScreenSpinner size='large' />);
		else setPopout(null);

	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<RegForm id='reg' setActivePanel={setActivePanel} togglePopout={togglePopout} fetchedUser={fetchedUser}/>
					<Home id='home' fetchedUser={fetchedUser} dataInfo={dataInfo} go={go} setActivePanel={setActivePanel}/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
