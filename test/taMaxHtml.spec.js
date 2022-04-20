describe('taMaxHtml', function(){
    'use strict';
    var $rootScope, $compile, $timeout;
    beforeEach(module('textAngular'));
    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
    }));

    it('should fail without ngmodel', function(){
        expect(function () {
            $compile('<div ta-max-html></div>')($rootScope);
            $rootScope.$digest();
        }).toThrow();
    });

    it('should fail without a value', function(){
        expect(function () {
            $compile('<div ng-model="test" ta-max-html></div>')($rootScope);
            $rootScope.$digest();
        }).toThrow('Max html must be an integer');
    });

    it('should fail without a numeric value', function(){
        expect(function () {
            $compile('<div ng-model="test" ta-max-html="worldspawn"></div>')($rootScope);
            $rootScope.$digest();
        }).toThrow('Max html must be an integer');
    });

    describe('when validating', function(){
        var $scope;
        beforeEach(function(){
            $scope = $rootScope.$new();
            $scope.maxHtml = 28;
            var form = angular.element('<form name="form"><input type="text" ng-model="model.html" ta-max-html="{{maxHtml}}" name="html" /></form>');
            $scope.model = { html : null };
            $compile(form)($scope);
            $scope.$digest();
        });

        it('should fail when html exceeds limit', function(){
            $scope.form.html.$setViewValue('<strong>textAngular_</strong>');
            $timeout.flush();
            expect($scope.form.html.$error.taMaxHtml).toBe(true);
        });

        it('should pass when html is within limit', function(){
            $scope.form.html.$setViewValue('<strong>textAngular</strong>');
            $timeout.flush();
            expect($scope.form.html.$error.taMaxHtml).toBe(undefined);
        });

        it('behaviour should change when max html limit is changed', function(){
            $scope.form.html.$setViewValue('<strong>textAngular_</strong>');
            $timeout.flush();
            expect($scope.form.html.$error.taMaxHtml).toBe(true);
            $scope.$apply(function(){
                $scope.maxHtml = 29;
            });
            $scope.$digest();
            expect($scope.form.html.$error.taMaxHtml).toBe(undefined);
        });

        it('should fail when max html limit is changed to non numeric value', function(){
            $scope.form.html.$setViewValue('<strong>textAngular__</strong>');
            $timeout.flush();
            expect($scope.form.html.$error.taMaxHtml).toBe(true);
            expect(function() {
                $scope.$apply(function(){
                    $scope.maxHtml = 'worldspawn';
                });
            }).toThrow('Max html must be an integer');
        });
    });
});