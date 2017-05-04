var myApp = angular.module('myApp', [])
	.config(function ($logProvider) {
		$logProvider.debugEnabled(globalAppVar.config.angular.loggingDebug);
	})
	.controller('editorController', ['$scope', 'ossService',
		function ($scope, ossService) {

			// $scope definition
			$scope.oss = {
				key: editorUtils.shared.data.currentObjKey
			};

			// bind editorUtils.shared.data.currentObjKey --> Angular $scope.oss.key
			editorUtils.shared.data.watch("currentObjKey", function (id, oldValue, newValue) {
				$scope.oss.key = newValue;
				return newValue;
			});
			// bind Angular $scope.oss.key --> editorUtils.shared.data.currentObjKey
			$scope.$watch('oss.key', function (newValue, oldValue, scope) {
				editorUtils.shared.data.currentObjKey = newValue;
			});

			editorUtils.shared.fn.putCloud = ossService.putCloud;
			editorUtils.shared.fn.getCloud = ossService.getCloud;
			editorUtils.shared.fn.listCloud = ossService.listCloud;
			editorUtils.shared.fn.removeCloud = ossService.removeCloud;

			editorUtils.shared.fn.putLocal = ossService.putLocal;
			editorUtils.shared.fn.getLocal = ossService.getLocal;
			editorUtils.shared.fn.listLocal = ossService.listLocal;
			editorUtils.shared.fn.removeLocal = ossService.removeLocal;

			editorUtils.init();

		}
	])
	.service('httpService', ['$http', 'logService', function ($http, logService) {
		this.post = function (apiurl, apidata,
		                      successFn,
		                      errorFn,
		                      exceptionFn) {
			logService.debug("send post request apiurl:" + apiurl + ", apidata:" + JSON.stringify(apidata));
			if (globalAppVar.config.angular.usePHPServer) {
				apidata = $.param(apidata);
			}
			$http({
				method: 'POST',
				url: apiurl,
				data: apidata,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			}).then(
				function (response) {
					logService.debug("receive post success response:" + JSON.stringify(response));
					if (successFn && typeof(successFn) == "function") {
						successFn(response);
					}
				},
				function (response) {
					logService.debug("receive post error response:" + JSON.stringify(response));
					if (errorFn && typeof(errorFn) == "function") {
						errorFn(response);
					}
				}
			).catch(
				function (response) {
					logService.debug("receive post exception response:" + JSON.stringify(response));
					if (exceptionFn && typeof(exceptionFn) == "function") {
						exceptionFn(response);
					}
				}
			);
		};
	}])
	.service('ossService', ['httpService', function (httpService) {
		var _this = this;
		this.buildURL = function (url) {
			if (globalAppVar.config.angular.usePHPServer) {
				url = "/phpServer" + url + "/server.php";
			}
			return url;
		}
		this.putCloud = function (successFn, objKey, objData) {
			httpService.post(_this.buildURL("/oss/put/cloud"), {
					bucketName: "",
					objects: [
						{
							key: objKey,
							content: objData
						}
					]
				},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					}
				});
		};
		this.getCloud = function (successFn, objKey) {
			httpService.post(_this.buildURL("/oss/get/cloud"), {
					bucketName: "",
					objects: [
						{
							key: objKey
						}
					]
				},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					}
				});
		};
		this.listCloud = function (successFn, errorFn) {
			httpService.post(_this.buildURL("/oss/list/cloud"), {},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					} else {
						errorFn(response.data);
					}
				});
		};
		this.removeCloud = function (successFn, objKey) {
			httpService.post(_this.buildURL("/oss/remove/cloud"), {
					bucketName: "",
					objects: [
						{
							key: objKey
						}
					]
				},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					}
				});
		};
		this.putLocal = function (successFn, objKey, objData) {
			httpService.post("/oss/put/local", {
					bucketName: "",
					objects: [
						{
							key: objKey,
							content: objData
						}
					]
				},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					}
				});
		};
		this.getLocal = function (successFn, objKey) {
			httpService.post("/oss/get/local", {
					bucketName: "",
					objects: [
						{
							key: objKey
						}
					]
				},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					}
				});
		};
		this.listLocal = function (successFn, errorFn) {
			httpService.post("/oss/list/local", {},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					} else {
						errorFn(response.data);
					}
				});
		};
		this.removeLocal = function (successFn, objKey) {
			httpService.post("/oss/remove/local", {
					bucketName: "",
					objects: [
						{
							key: objKey
						}
					]
				},
				function (response) {
					if (response.data.success) {
						successFn(response.data);
					}
				});
		};
	}])
	.service('logService', ['$log', function ($log) {
		this.debug = function (logMsg) {
			$log.debug("=====>>>> DEBUG: " + logMsg);
		};
	}]);