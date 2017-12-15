import should from 'should'
import PlistTestPrepare from './pretest'
import LaunchCtl from '../launchctl'
let pretest = new PlistTestPrepare('asynchronous');
let service = new LaunchCtl(pretest.agentPath);
before(function() {
    pretest.prepare()
});

after(function() {
    pretest.clear()
});

describe('LaunchCtl asynchronous API', function() {
    describe('constructor', function() {
        it('After constructing should have property "path"', function() {
            service.should.have.property('path');
        });
    });
    describe('init', function() {
        it('After initialization should have property "name"', async function() {
            await service.init();
            service.should.have.property('name');
        });
    });
    describe('running', function() {
        it('Service should be running', async function() {
            let running = await service.running();
            running.should.be.true()
        });
    });
    describe('unload', function() {
        it('Service should not be running after unloading', async function() {
            await service.unload();
            let running = await service.running();
            running.should.be.false()
        });
    });
    describe('load', function() {
        it('Service should be running after loading', async function() {
            await service.load();
            let running = await service.running();
            running.should.be.true()
        });
    });
});