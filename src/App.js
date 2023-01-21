import { useEffect, useState } from 'react';
import { Input, List, Typography } from 'antd';
import './App.css';
import { changeConfirmLocale } from 'antd/es/modal/locale';

function App() {
  const [libs, setLibs] = useState([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    fetch('https://api.cdnjs.com/libraries')
    .then((response) =>response.json())
    .then((data) =>setLibs(data.results));

  }, []);

  const searchConfig = {
    value: search,
    onChange: (e) => setSearch(e.target.value),
    placeholder: "Search from cdn :)",
    className: "input-box"
  };

  const re = new RegExp(`${search}`, 'g');

  return (<div class="app">
    <Typography.Title level={2} style={{textAlign: 'center'}}>
      Javascript Injector
    </Typography.Title>
  <Input {...searchConfig} />
  <div
      id="scrollableDiv"
      style={{
        height: 200,
        overflow: 'auto',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
    <List
    className="list"
    bordered
    dataSource={libs.filter((lib) => search ? lib?.name?.match(re) : true )}
    renderItem={(item) => (
        <List.Item>
          <div style={{cursor: "pointer"}} onClick={() => {
            function getItem() {
              return item.latest;
            }
            global.chrome.tabs.query({active:true}, (tabs) => {
              const [tab] = tabs;
              global.chrome.scripting.executeScript({
                target : {tabId : tab.id},
                func : function (url) {
                    const s = document.createElement("script");
                    s.type = "text/javascript";
                    s.src = url;
                    document.body.append(s);
                },
                args: [getItem()]
              })
              .then(() => console.log("script injected"));
            });
          }}>{item.name}</div>
        </List.Item>
    )}
    />
  </div>
  </div>);
}

export default App;
