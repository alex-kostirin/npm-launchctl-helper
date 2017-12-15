import should from 'should'
import PlistTestPrepare from './pretest'
import LaunchCtl from '../launchctl'
let pretest = new PlistTestPrepare('synchronous');
let service = new LaunchCtl(pretest.agentPath);
before(function() {
    pretest.prepare()
});

after(function() {
    pretest.clear()
});

describe('LaunchCtl synchronous API', function() {
    describe('constructor', function() {
        it('After constructing should have property "path"', function() {
            service.should.have.property('path');
        });
    });
    describe('initSync', function() {
        it('After initialization should have property "name"', function() {
             service.initSync();
            service.should.have.property('name');
        });
    });
    describe('runningSync', function() {
        it('Service should be running', function() {
            let running = service.runningSync();
            running.should.be.true()
        });
    });
    describe('unloadSync', function() {
        it('Service should not be running after unloading', function() {
            service.unloadSync();
            let running = service.runningSync();
            running.should.be.false()
        });
    });
    describe('loadSync', function() {
        it('Service should be running after loading', function() {
            service.loadSync();
            let running = service.runningSync();
            running.should.be.true()
        });
    });
});
