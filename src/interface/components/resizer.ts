import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import StaticConfig from 'StaticConfig'

const styleWrapper = style`
	&{
		user-select: none;
		&[direction="horizontally"]{
			cursor:e-resize;
		}
		&[direction="vertically"]{
			cursor:n-resize;
		}
	}
	&[blocked=false]{
		padding:3px;
	}
`

export default function resizerComponent() {

	function resizerMounted() {
		const direction = this.getAttribute('direction')

		if(direction === 'horizontally'){
			StaticConfig.keyChanged('appEnableSidepanel', value => {
				this.setAttribute('blocked', !value)
				if (!value) this.style.width = '0'
			})
		}else{
			this.setAttribute('blocked', 'false')
		}

	}
	
	return element`
		<div blocked="${!StaticConfig.data.appEnableSidepanel}" mounted="${resizerMounted}" :mousedown="${working}" class="${styleWrapper}"/>
	`
}

function working() {
	
	const resizerElement = this
	const direction = resizerElement.getAttribute('direction')
	let resizerOffset = direction === 'horizontally' ?  StaticConfig.data.appEnableSidebar ? 85 : 55 : 55
	
	if(direction === 'horizontally'){
		StaticConfig.keyChanged('appEnableSidebar', status => {
			if (status) {
				resizerOffset = 85
			} else {
				resizerOffset = 55
			}
		})
	}
	
	window.addEventListener('mousemove', startResizing, false)
	window.addEventListener('mouseup', stopResizing, false)
	
	function startResizing(event) {

		if (resizerElement.getAttribute('blocked') === 'true') return
		const otherChildren = resizerElement.parentElement.children
		let leftPanel = null
		Object.keys(otherChildren).forEach((el, index: number) => {
			const child = otherChildren[index]
			if (child == resizerElement) {
				leftPanel = otherChildren[index - 1]
			}
		})

		if(direction === 'horizontally'){
			leftPanel.style.width = `${event.clientX - resizerOffset}px`
		}else{
			leftPanel.style.height = `${event.clientY - resizerOffset}px`
		}
		
	}

	function stopResizing() {
		window.removeEventListener('mousemove', startResizing, false)
		window.removeEventListener('mouseup', stopResizing, false)
	}
	
}

