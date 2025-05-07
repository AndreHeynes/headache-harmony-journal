
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";

// Types and utilities
import { VariableDefinition, VariableType, VariableValueType, VariableTrackingTime } from './variables/types';
import { VARIABLE_TEMPLATES } from './variables/templates';
import { fetchWeatherData } from './variables/weatherApi';

// Components
import { WarningBanner } from './variables/WarningBanner';
import { VariableCounter } from './variables/VariableCounter';
import { SelectedVariablesList } from './variables/SelectedVariablesList';
import { VariableTemplatesList } from './variables/VariableTemplatesList';
import { FinalReview } from './variables/FinalReview';
import { CustomVariableForm } from './variables/CustomVariableForm';
import { ActionButtons } from './variables/ActionButtons';

export default function LogVariables() {
  const navigate = useNavigate();
  const [selectedVariables, setSelectedVariables] = useState<VariableDefinition[]>([]);
  const [customVariableName, setCustomVariableName] = useState('');
  const [customVariableType, setCustomVariableType] = useState<VariableType>('trigger');
  const [customValueType, setCustomValueType] = useState<VariableValueType>('scale');
  const [customTrackingTime, setCustomTrackingTime] = useState<VariableTrackingTime>('before');
  const [customDescription, setCustomDescription] = useState('');
  const [variableSelectionStep, setVariableSelectionStep] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [finalReview, setFinalReview] = useState<boolean>(false);
  const [variableOptions, setVariableOptions] = useState<string[]>([]);
  const [currentEditingVariable, setCurrentEditingVariable] = useState<VariableDefinition | null>(null);
  
  const MAX_VARIABLES = 4;
  const remainingSlots = MAX_VARIABLES - selectedVariables.length;

  // Weather API Integration (could be used for one of the variables)
  const { data: weatherData } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeatherData,
    enabled: true, // Enable the query by default
  });

  const handleAddVariable = (template?: VariableDefinition) => {
    if (selectedVariables.length >= MAX_VARIABLES) {
      toast.error("Maximum variable limit reached", {
        description: "You can only track up to 4 variables"
      });
      return;
    }

    if (template) {
      // Add predefined template
      if (!selectedVariables.some(v => v.id === template.id)) {
        setSelectedVariables([...selectedVariables, template]);
        toast.success("Variable added", {
          description: `${template.name} has been added to your tracking list`
        });
      } else {
        toast.error("Variable already added", {
          description: "This variable is already in your tracking list"
        });
      }
    } else {
      // Add custom variable
      if (!customVariableName.trim()) {
        toast.error("Missing information", {
          description: "Please provide a name for your variable"
        });
        return;
      }

      const newVariable: VariableDefinition = {
        id: `custom_${Date.now()}`,
        name: customVariableName,
        description: customDescription || `Track ${customVariableName.toLowerCase()}`,
        type: customVariableType,
        valueType: customValueType,
        trackingTime: customTrackingTime,
        options: customValueType === 'selection' ? variableOptions : undefined,
        min: customValueType === 'scale' || customValueType === 'numeric' ? 0 : undefined,
        max: customValueType === 'scale' ? 10 : (customValueType === 'numeric' ? 100 : undefined),
        defaultValue: customValueType === 'scale' ? 5 : (customValueType === 'numeric' ? 0 : (customValueType === 'boolean' ? false : ''))
      };

      setSelectedVariables([...selectedVariables, newVariable]);
      
      // Reset form
      resetForm();
      
      toast.success("Custom variable added", {
        description: `${newVariable.name} has been added to your tracking list`
      });
    }
  };

  const resetForm = () => {
    setCustomVariableName('');
    setCustomDescription('');
    setCustomVariableType('trigger');
    setCustomValueType('scale');
    setCustomTrackingTime('before');
    setVariableOptions([]);
  };

  const handleRemoveVariable = (variable: VariableDefinition) => {
    setSelectedVariables(selectedVariables.filter(v => v.id !== variable.id));
    toast.info("Variable removed", {
      description: `${variable.name} has been removed from your tracking list`
    });
  };

  const handleEditVariable = (variable: VariableDefinition) => {
    setCurrentEditingVariable(variable);
    setCustomVariableName(variable.name);
    setCustomDescription(variable.description);
    setCustomVariableType(variable.type);
    setCustomValueType(variable.valueType);
    setCustomTrackingTime(variable.trackingTime);
    setVariableOptions(variable.options || []);
    setEditing(true);
    setVariableSelectionStep(false);
  };

  const handleUpdateVariable = () => {
    if (!currentEditingVariable) return;
    
    const updatedVariable: VariableDefinition = {
      ...currentEditingVariable,
      name: customVariableName,
      description: customDescription,
      type: customVariableType,
      valueType: customValueType,
      trackingTime: customTrackingTime,
      options: customValueType === 'selection' ? variableOptions : undefined,
    };

    setSelectedVariables(
      selectedVariables.map(v => v.id === currentEditingVariable.id ? updatedVariable : v)
    );

    // Reset edit mode
    setEditing(false);
    setVariableSelectionStep(true);
    setCurrentEditingVariable(null);
    resetForm();

    toast.success("Variable updated", {
      description: `${updatedVariable.name} has been updated`
    });
  };

  const handleSaveVariables = () => {
    // This would save to your backend/database
    console.log('Saving variables to database:', selectedVariables);
    
    // Structure the data in a way that makes backend processing easier
    const variableConfig = {
      userId: 'user123', // This would come from auth
      variables: selectedVariables.map(variable => ({
        variableId: variable.id,
        name: variable.name,
        type: variable.type,
        valueType: variable.valueType,
        trackingTime: variable.trackingTime,
        options: variable.options,
        min: variable.min,
        max: variable.max,
        defaultValue: variable.defaultValue
      })),
      createdAt: new Date().toISOString(),
      modifiedAt: null, // This setup prevents modification
      // The selection is locked after saving
      locked: true
    };
    
    console.log('Variable configuration for database:', variableConfig);
    
    toast.success("Variables saved successfully", {
      description: "Your variables have been locked and cannot be modified"
    });
    
    // Navigate back to the log page or dashboard
    navigate('/log');
  };

  const handleCancel = () => {
    if (editing) {
      // Cancel editing
      setEditing(false);
      setVariableSelectionStep(true);
      setCurrentEditingVariable(null);
      resetForm();
    } else if (finalReview) {
      // Back from final review
      setFinalReview(false);
    } else if (!variableSelectionStep) {
      // Back to variable selection
      setVariableSelectionStep(true);
    } else {
      // Cancel the whole process
      navigate('/log');
    }
  };

  // Get available variable templates (filtering out already selected ones)
  const availableTemplates = VARIABLE_TEMPLATES.filter(
    template => !selectedVariables.some(v => v.id === template.id)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 pb-20">
      <header className="flex items-center justify-between mb-6">
        <button className="text-gray-400" onClick={handleCancel}>
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <h1 className="text-xl font-semibold">
          {finalReview 
            ? "Review Variables" 
            : (editing 
                ? `Edit ${currentEditingVariable?.name}` 
                : (variableSelectionStep 
                    ? "Custom Variables" 
                    : "Add New Variable"))}
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </header>

      <WarningBanner />
      <VariableCounter count={selectedVariables.length} maxCount={MAX_VARIABLES} />

      {/* Main Content */}
      {finalReview ? (
        <FinalReview 
          variables={selectedVariables} 
          onGoBack={() => setFinalReview(false)} 
          onSave={handleSaveVariables} 
        />
      ) : variableSelectionStep ? (
        <div className="space-y-6">
          <SelectedVariablesList 
            variables={selectedVariables} 
            onEdit={handleEditVariable} 
            onRemove={handleRemoveVariable} 
          />

          <VariableTemplatesList 
            templates={availableTemplates} 
            onAdd={handleAddVariable}
            onCreateCustom={() => setVariableSelectionStep(false)}
            remainingSlots={remainingSlots}
          />

          <ActionButtons 
            onCancel={handleCancel} 
            onReview={() => setFinalReview(true)} 
            isDisabled={selectedVariables.length === 0} 
          />
        </div>
      ) : (
        <CustomVariableForm 
          isEditing={editing}
          variableName={customVariableName}
          setVariableName={setCustomVariableName}
          description={customDescription}
          setDescription={setCustomDescription}
          variableType={customVariableType}
          setVariableType={setCustomVariableType}
          valueType={customValueType}
          setValueType={setCustomValueType}
          trackingTime={customTrackingTime}
          setTrackingTime={setCustomTrackingTime}
          options={variableOptions}
          setOptions={setVariableOptions}
          onCancel={handleCancel}
          onSubmit={editing ? handleUpdateVariable : () => handleAddVariable()}
        />
      )}
    </div>
  );
}
