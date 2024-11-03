import gsap from 'gsap'
import Flip from 'gsap/Flip'

class App {
	constructor() {
		// Register plugin before using it
		gsap.registerPlugin(Flip)

		// Store html elements as class props
		this._getElems()
		// Create reveal timeline
		this._initTimelineHeroReveal()
	}

	_getElems() {
		this.preloaderBackground = document.querySelector('.preloader__background')
		this.preloaderText = document.querySelector('.preloader__text span')
		this.heroTitles = [...document.querySelectorAll('.hero__title span span')]
		this.heroImageStart = document.querySelector('.hero-image-start')
		this.heroCaption = document.querySelector('.hero__caption span')
		this.heroButton = document.querySelector('.hero__button')
		this.heroImageWrapper = document.querySelector('.hero__image')
		this.heroImage = document.querySelector('.hero__image img')
		this.headerItems = [...document.querySelectorAll('.header *')]
	}

	_setElemsHeroReveal() {
		gsap.set(this.headerItems, { y: 24, autoAlpha: 0 })

		gsap.set(this.heroButton, {
			y: 64,
			autoAlpha: 0,
		})

		gsap.set([this.preloaderText, this.heroTitles, this.heroCaption], {
			yPercent: 110,
		})
	}

	_preloaderAnimation() {
		const tl = gsap.timeline({
			defaults: {
				ease: 'power3.out',
				duration: 0.6,
			},
		})

		// text arrives from bottom
		tl.to(this.preloaderText, {
			yPercent: 0,
			delay: 0.6,
		})
			// text leaves to top
			.to(this.preloaderText, {
				yPercent: -110,
				delay: 1,
			})
			// background leaves to top
			.to(
				this.preloaderBackground,
				{
					yPercent: -100,
					duration: 1.4,
					ease: 'power4.inOut',
				},
				'<+0.2',
			)

		return tl
	}

	_imageAnimation() {
		const tl = gsap.timeline({
			defaults: {
				ease: 'power3.inOut',
				duration: 2,
			},
		})

		// get image state when it is contained inside the hero
		const state = Flip.getState(this.heroImageWrapper)
		// take image out of hero and append it in external wrapper
		this.heroImageStart.appendChild(this.heroImageWrapper)

		// animate image to its original size
		tl.from(this.heroImage, {
			scale: 1.6,
		})
			// make sure border radius is animated
			.to(
				this.heroImageWrapper,
				{
					borderRadius: (16 * 100) / 1440 + 'vw',
				},
				'<',
			)
			.add(() => {
				// animate image back to its original position/container
				Flip.to(state, { duration: 2, ease: 'power3.inOut' })
			}, '<')

		return tl
	}

	_uiAnimation() {
		const tl = gsap.timeline({
			defaults: {
				ease: 'power3.out',
				duration: 1.2,
				yPercent: 0,
				y: 0,
			},
		})

		// animate UI elements with staggers & delays
		tl.to(this.heroTitles, {
			stagger: 0.2,
		})
			.to(this.heroCaption, {}, '<+0.6')
			.to(
				this.heroButton,
				{
					autoAlpha: 1,
				},
				'<',
			)
			.to(
				this.headerItems,
				{
					stagger: 0.2,
					autoAlpha: 1,
				},
				'<+0.2',
			)

		return tl
	}

	_initTimelineHeroReveal() {
		const heroReveal = gsap.timeline()

		// Set gsap properties for animations
		this._setElemsHeroReveal()

		heroReveal
			.add(this._preloaderAnimation())
			.add(this._imageAnimation(), '<+2.2')
			.add(this._uiAnimation(), '<+1')
	}
}

new App()
