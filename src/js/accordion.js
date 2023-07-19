const scrollToAccordion = (aid, accItem, accHead) => {
	const anchorElement = $(`${accItem}${aid} ${accHead}`)
	$("html,body").animate({ scrollTop: anchorElement.offset().top }, "slow")
}

const kodzillaAccordion = () => {
	const acc = ".kdz-accordion",
		accItem = ".kdz-accItem",
		accPane = ".kdz-accPane",
		accHead = ".kdz-accHead"

	const closedOthers = $(acc).data("closed-other") === "yes"

	$(`${accItem} ${accHead}`).on("click", function (e) {
		e.preventDefault()
		const $this = $(this).closest(accItem)
		const isActive = $this.hasClass("active")
		const $panes = $(accPane, $this)
		if (isActive) {
			$this.removeClass("active")
			$panes.stop().slideUp()
		} else {
			if (closedOthers) {
				$(accItem).removeClass("active")
				$(accPane).stop().slideUp()
			}
			$this.addClass("active")
			$panes.stop().slideDown()
		}
	})

	if ($(acc).data("first-open") === "yes") {
		$(`${accItem}:first-child ${accHead}`).trigger("click")
	}

	if (window.location.hash) {
		scrollToAccordion(window.location.hash, accItem, accHead)
		$(`${accItem}${window.location.hash} ${accHead}`).trigger("click")
	}
}

export default kodzillaAccordion
