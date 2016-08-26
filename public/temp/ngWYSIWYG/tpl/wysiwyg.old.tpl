<div class="tinyeditor">
    <div class="tinyeditor-header" ng-hide="editMode" >
        <div ng-hide="editMode">
            <div flex>
                <md-select ng-model="textstyle" placeholder="Style" class="tinyeditor-select">
                    <md-option ng-repeat="s in styles" value="{{s.key}}">{{s.name}}</md-option>
                </md-select>
                <md-button class="md-raised tinyeditor-control" aria-label="B" style="background-position-y: -120px;" ng-click="execCommand('bold')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="I" style="background-position-y: -150px;" ng-click="execCommand('italic')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="U" style="background-position-y: -180px;" ng-click="execCommand('underline')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="Delete line" style="background-position-y: -210px;" ng-click="execCommand('strikethrough')"></md-button>

                <md-button class="md-raised tinyeditor-control" aria-label="Ordered list" style="background-position-y: -300px;" ng-click="execCommand('insertorderedlist')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="Unorderd list" style="background-position-y: -330px;" ng-click="execCommand('insertunorderedlist')"></md-button>
            </div>
            <div flex>
                <md-button class="md-raised tinyeditor-control" aria-label="In>" style="background-position-y: -360px;" ng-click="execCommand('outdent')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="Out<" style="background-position-y: -390px;" ng-click="execCommand('indent')"></md-button>
            
            
                <md-button class="md-raised tinyeditor-control" aria-label="Left" style="background-position-y: -420px;" ng-click="execCommand('justifyleft')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="Center" style="background-position-y: -450px;" ng-click="execCommand('justifycenter')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="Right" style="background-position-y: -480px;" ng-click="execCommand('justifyright')"></md-button>

                <md-button class="md-raised ng-scope tinyeditor-control" aria-label="Clear Format" style="background-position-y: -720px;" ng-click="execCommand('removeformat')"></md-button>
            </div>
            <div flex>
                <md-button class="md-raised tinyeditor-control" aria-label="Undo" style="background-position-y: -540px;" ng-click="execCommand('undo')"></md-button>
                <md-button class="md-raised tinyeditor-control" aria-label="Redo" style="background-position-y: -570px;" ng-click="execCommand('redo')"></md-button>
      	        <md-button class="md-raised tinyeditor-control" aria-label="Link" style="background-position-y: -660px;" ng-click="insertLink()"></md-button>
          		<md-button class="md-raised tinyeditor-control" aria-label="Unlink" style="background-position-y: -690px;" ng-click="execCommand('unlink')"></md-button>
                
                <choose-file-button>
                    <md-button aria-label="Upload a file" class="md-raised tinyeditor-control" style="background-position-y: -600px;" ng-click="insertImage()">
                    </md-button>
                    <input type="file" onchange="angular.element(this).scope().uploadFile(this)" accept="image/*">
                </choose-file-button>
            </div>
      
          <!--<div class="btn-group">
          		<select class="md-raised dropdown-toggle" ng-model="font" ng-options="a as a for a in fonts">
          			<option value="">Font</option>
          		</select>
          		<select class="md-raised dropdown-toggle" ng-model="fontsize" ng-options="a as a for a in fontsizes">
          			<option value="">...</option>
          		</select>
          		<select class="md-raised dropdown-toggle" ng-model="textstyle" ng-options="s.key as s.name for s in styles">
          			<option value="">Style</option>
          		</select>
          </div>-->
          <!--<md-button class="md-raised tinyeditor-control" aria-label="Color" style="background-position-y: -779px; position: relative;" ng-click="showFontColors = !showFontColors">
          	    	<colors-grid show="showFontColors" on-pick="setFontColor(color)"><colors-grid>
          		</md-button>
          		<md-button class="md-raised tinyeditor-control" aria-label="Background" style="background-position-y: -808px; position: relative;" ng-click="showBgColors = !showBgColors">
          	    	<colors-grid show="showBgColors" on-pick="setBgColor(color)"><colors-grid>
          		</md-button>
    
          		<md-button class="md-raised tinyeditor-control" aria-label="Image" style="background-position-y: -600px;" ng-click="insertImage()"></md-button>
          		<!--<md-button class="md-raised tinyeditor-control" aria-label="Divider" style="background-position-y: -630px;" ng-click="execCommand('inserthorizontalrule')"></md-button>
          		<md-button class="md-raised tinyeditor-control" aria-label="Symbol" style="background-position-y: -838px; position: relative;" ng-click="showSpecChars = !showSpecChars">
          	    	<symbols-grid show="showSpecChars" on-pick="insertSpecChar(symbol)"><symbols-grid>
          		</md-button>-->
          		</div>
    </div>
    <div class="sizer">
  		<textarea data-placeholder-attr="" style="-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; resize: none; width: 100%; height: 100%;" ng-show="editMode" ng-model="content">
  		</textarea>
  		<iframe style="-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100%; height: 100%;" ng-hide="editMode" wframe="" ng-model="content">
  		</iframe>
    </div>
    <div class="tinyeditor-footer">
		<div ng-switch="editMode" ng-click="editMode = !editMode" class="toggle">
			<span ng-switch-when="true">wysiwyg</span>
			<span ng-switch-default>source</span>
		</div>
    </div>
    <ul>
        <li ng-repeat="item in uploader.queue">
            Name: <span ng-bind="item.file.name"></span><br/>
            <button ng-click="item.upload()">upload</button>
        </li>
    </ul>
</div>