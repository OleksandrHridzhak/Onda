import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { IconSelector } from "shared/ui/IconSelector";
import { VisibilityToggle } from "shared/ui/VisibilityToggle";
import { Button } from "shared/ui/Button";
import { Field } from "shared/ui/Field";
import { Input } from "shared/ui/Input";
import { Textarea } from "shared/ui/Textarea";
import { icons } from "shared/lib/icons";
import { useColumnMenuContext } from "./ColumnMenuContext";

export const ColumnBasicSettings = (): React.ReactElement => {
  const { form, actions, ui, canMoveLeft, canMoveRight } =
    useColumnMenuContext();

  return (
    <>
      {/* Name Input Section */}
      <div className="flex gap-2 w-full">
        <IconSelector
          selectedIcon={form.selectedIcon}
          setSelectedIcon={actions.setSelectedIcon}
          isIconSectionExpanded={ui.isIconSectionExpanded}
          setIsIconSectionExpanded={() =>
            ui.setIsIconSectionExpanded(!ui.isIconSectionExpanded)
          }
          icons={icons}
        />
        <div className="w-full flex relative">
          <Input
            type="text"
            value={form.name}
            onChange={(e) => actions.setName(e.target.value)}
            placeholder="Column name"
            aria-label="Column name"
          />
          <div className="flex items-center h-12 w-12 justify-center absolute right-0 top-0">
            <VisibilityToggle
              isVisible={form.showTitle}
              onToggle={actions.setShowTitle}
              ariaLabel={
                form.showTitle ? "Hide column title" : "Show column title"
              }
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <Textarea
        value={form.description}
        placeholder="Description"
        onChange={(e) => actions.setDescription(e.target.value)}
        rows={3}
        aria-label="Column description"
      />

      {/* Position Controls Section */}
      <Field label="Column Position and Width" className="mb-4">
        <div className="flex space-x-2">
          <div className="w-full">
            <Input
              type="number"
              value={form.width}
              onChange={actions.handleWidthChange}
              min="0"
              max="1000"
              placeholder="Enter width in pixels"
              aria-label="Column width"
              inputSize="sm"
              className="bg-transparent"
            />
          </div>
          <Button
            variant="secondary"
            onClick={actions.handleMoveLeft}
            disabled={!canMoveLeft}
          >
            <ArrowLeft size={18} /> LEFT
          </Button>
          <Button
            variant="secondary"
            onClick={actions.handleMoveRight}
            disabled={!canMoveRight}
          >
            RIGHT <ArrowRight size={18} />
          </Button>
        </div>
      </Field>
    </>
  );
};
