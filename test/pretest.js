import expandPath from 'expand-tilde'
import {execSync} from 'child_process'

class PlistTestPrepare {
    constructor(test_name) {
        this.testName = test_name;
        this.samplePlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.testlaunchctl.${this.testName}</string>
    <key>ProgramArguments</key>
    <array>
        <string>test</string>
    </array>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>`;
        this.agentsDir = expandPath('~/Library/LaunchAgents/');
        this.plistName = `com.testlaunchctl.${this.testName}.plist`;
        this.agentPath = this.agentsDir + this.plistName
    }

    prepare() {
        execSync(`mkdir -p ${this.agentsDir}`);
        try {
            execSync(`launchctl unload ${this.agentPath}`);
            execSync(`rm ${this.agentPath}`)
        }
        catch (err) {
        }
        execSync(`echo "${this.samplePlist}" > ${this.agentPath}`);
        execSync(`launchctl load ${this.agentPath}`)
    }

    clear() {
        try {
            execSync(`launchctl unload ${this.agentPath}`);
            execSync(`rm ${this.agentPath}`)
        }
        catch (err) {
        }
    }
}

export {PlistTestPrepare as default}