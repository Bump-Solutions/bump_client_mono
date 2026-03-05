import { useEffect } from "react";
import { ChromePicker, type ColorResult } from "react-color";
import { toast } from "sonner";
import { useProfile } from "../../context/profile/useProfile";
import { useSetProfileBackgroundColor } from "../../hooks/profile/useSetProfileBackgroundColors";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import StateButton from "../../components/StateButton";

import { Check, Pencil } from "lucide-react";

type ColorProps = {
  color: string;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
};

const Color = ({ color, selectedColor, setSelectedColor }: ColorProps) => {
  const isSelected = color === selectedColor;

  const handleColorClick = () => {
    setSelectedColor(isSelected ? null : color);
  };

  return (
    <div
      className={`color-box ${isSelected ? "selected" : ""}`}
      style={{ backgroundColor: color }}
      onClick={handleColorClick}>
      {isSelected && (
        <span>
          <Check strokeWidth={3} className='svg-18' />
        </span>
      )}
    </div>
  );
};

type BgColorPickerProps = {
  isOpen: boolean;
  close: () => void;
  dominantColor: string | null;
  palette: string[] | null;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
};

const BgColorPicker = ({
  isOpen,
  close,
  dominantColor,
  palette,
  selectedColor,
  setSelectedColor,
}: BgColorPickerProps) => {
  const { setUser } = useProfile();

  useEffect(() => {
    setSelectedColor(dominantColor);
  }, [dominantColor, setSelectedColor]);

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };

  const setProfileBackgroundColorMutation = useSetProfileBackgroundColor(() => {
    setUser({ profileBackgroundColor: selectedColor });
    close();
  });

  const handleSaveColor = async () => {
    if (!selectedColor) return;

    const promise =
      setProfileBackgroundColorMutation.mutateAsync(selectedColor);

    toast.promise(promise, {
      loading: "Háttérszín beállítása folyamatban...",
      success: "Háttérszín módosítva.",
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba a háttérszín beállítása során.",
    });

    return promise;
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <h1 className='modal__title'>🎨 Háttérszín beállítása</h1>

      <div className='modal__content'>
        <p>
          Alakítsd kedvedre a profilod megjelenését egy új háttérszínnel.
          Válassz a <i>profilképedről</i>
        </p>

        <div className='color-box__wrapper'>
          {palette &&
            palette.map((color) => (
              <Color
                key={color}
                color={color}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            ))}
        </div>

        <p className='ta-center'>vagy</p>

        <div className='color-picker__wrapper'>
          <ChromePicker
            color={selectedColor ?? dominantColor ?? undefined}
            onChange={handleColorChange}
            disableAlpha
          />
        </div>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={setProfileBackgroundColorMutation.isPending}
          onClick={close}
        />
        <StateButton
          className='primary'
          text='Mentés'
          onClick={handleSaveColor}>
          <Pencil />
        </StateButton>
      </div>
    </Modal>
  );
};

export default BgColorPicker;
