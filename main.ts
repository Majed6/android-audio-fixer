import {MarkdownView, Plugin} from 'obsidian';

export default class AndroidAudioFixer extends Plugin {
	async onload() {
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'fix-audio',
			name: 'Fix audio',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						//get all audio elements in the active view
						const audioFiles = markdownView.containerEl.querySelectorAll("audio");
						//if there are no audio elements, return
						if (!audioFiles) {
							return;
						}
						audioFiles.forEach(async (audio) => {
							// if has processed class, return
							if (audio.classList.contains('processed')) {
								return;
							} else {
								audio.classList.add('processed');
								const file = await fetch(audio.src);
								const fileB = await file.blob();
								audio.src = URL.createObjectURL(fileB);
							}
						});
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});
	}
}
