import {puffin} from '@mkenzo_8/puffin'
import Window from '../../constructors/window'
import {Titles , RadioGroup } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import SideMenu from '../../components/window/side.menu'
import ExtensionsRegistry from 'ExtensionsRegistry'
import LanguageConfig from 'LanguageConfig'

function Settings(){
    const SettingsPage = puffin.element(`
        <SideMenu default="customization">
            <div>
                <H1 lang-string="Settings"></H1>
                <label to="customization">Customization</label>
                <label to="about">About</label>
            </div>
            <div>
                <div href="customization">
                    <H3>Themes</H3>
                    <RadioGroup radioSelected="$selected">
                        ${(function(){
                            let content = "";
                            const list = ExtensionsRegistry.registry.data.list
                            Object.keys(list).map(function(extension){
                                const pkg = ExtensionsRegistry.registry.data.list[extension]
                                if(pkg.type == "theme"){
                                    content +=`
                                        <label name="${extension}" checked="${StaticConfig.data.theme == extension?'':'false'}">${extension}</label>
                                    `
                                }
                            })
                            return content
                        })()}
                    </RadioGroup>
                </div>
                <div href="about">
                    <p>Graviton is a modern looking code editor.</p>
                </div>
            </div>
        </SideMenu>
    `,{
        components:{
            RadioGroup,
            H1:Titles.h1,
            H3:Titles.h3,
            SideMenu
        },
        methods:{
            selected(e){
                const newTheme = e.detail.target.getAttribute("name")
                
                if( StaticConfig.data.theme != newTheme)
                    StaticConfig.data.theme = newTheme
            }
        },
        addons:{
            lang:puffin.lang(LanguageConfig)
        }
    })

    return new Window({
        component:SettingsPage
    })
}


export default Settings