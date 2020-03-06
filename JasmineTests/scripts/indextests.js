describe('testPolinom', function () {
    var classic = null;

    beforeEach(function () {
        classic = new obj();
        
    });

    it('polinom [1,0,4,6,7] and [8,9,5,1,9,0,4,0] is [8,9,37,85,139,97,81,61,79,24,28,0]', function () {
        expect(classic.addThreeToNumber([1, 0, 4, 6, 7], [8, 9, 5, 1, 9, 0, 4, 0])).toEqual([8, 9, 37, 85, 139, 97, 81, 61, 79, 24, 28,0]);
    });

    it('polinom [] and [] is []', function () {
        expect(classic.addThreeToNumber([], [])).toEqual([]);
    });
    it('polinom [-1, -1, -1, -4, 6] and [] is []', function () {
        expect(classic.addThreeToNumber([-1, -1, -1, -4, 6] , [])).toEqual([0,0,0,0]);
    });
    it('polinom [-1] and [] is []', function () {
        expect(classic.addThreeToNumber([-1], [])).toEqual([]);
    });

});
describe('testMultiply', function () {
    var classic = null;
    beforeEach(function () {
        classic = new obj();
    });
    it('2*2=4', function () {
        expect(classic.multiply(2, 2)).toEqual(4);
    });
});

describe("Try first spy", function () {
    var classic = null;

    beforeEach(function () {
        classic = new obj();
        spyOn(classic, 'multiply');
        classic.addThreeToNumber([-1,2], [1,2]);
    });

    it("tracks that the spy was called", function () {
        expect(classic.multiply).toHaveBeenCalled();
    });

    it("tracks all the arguments of its calls", function () {
        expect(classic.multiply).toHaveBeenCalledWith(-1,1);
        expect(classic.multiply).toHaveBeenCalledWith(-1, 2);
    });
    it("tracks number of calls", function () {
        expect(classic.multiply.calls.count()).toEqual(4);
    });

});

describe("Try fake spy", function () {
    var classic = null;

    beforeEach(function () {
        classic = new obj();
        spyOn(classic, 'multiply').and.callFake(function (a,b) { return a*b; });
        classic.addThreeToNumber([-1, 2], [1, 2]);
    });

    it("tracks that the spy was called", function () {
        expect(classic.multiply).toHaveBeenCalled();
    });

    it("tracks all the arguments of its calls", function () {
        expect(classic.multiply).toHaveBeenCalledWith(-1, 1);
        expect(classic.multiply).toHaveBeenCalledWith(-1, 2);
    });
    it("tracks number of calls", function () {
        expect(classic.multiply.calls.count()).toEqual(4);
    });

});

//Создания объекта заглушки осуществляется с помощью createSpyObj.
//В качестве параметров createSpyObj принимает имя объекта и массив строк,
//    являющийся списком методов объекта заглушки:
describe("Try stub spy", function () {
    var classic = null;

    beforeEach(function () {
        classic = jasmine.createSpyObj('OBJ', ['multiply'])
        classic.multiply(-1, 1);
        classic.multiply(-1, 2);
    });

    it("tracks that the spy was called", function () {
        expect(classic.multiply).toHaveBeenCalled();
    });

    it("tracks all the arguments of its calls", function () {
        expect(classic.multiply).toHaveBeenCalledWith(-1, 1);
        expect(classic.multiply).toHaveBeenCalledWith(-1, 2);
    });
    it("tracks number of calls", function () {
        expect(classic.multiply.calls.count()).toEqual(2);
    });

});

