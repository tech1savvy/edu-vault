import logging
import os
import sys

LOG_FORMAT = "%(asctime)s %(levelname)s %(name)s: %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


class ColorFormatter(logging.Formatter):
    COLORS = {
        "DEBUG": "\033[36m",  # Cyan
        "INFO": "\033[32m",  # Green
        "WARNING": "\033[33m",  # Yellow
        "ERROR": "\033[31m",  # Red
        "CRITICAL": "\033[91m",  # Bold Red
    }
    RESET = "\033[0m"

    def format(self, record):
        color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{color}{record.levelname}{self.RESET}"
        return super().format(record)


def setup_logger(name: str = "semantic-ranking") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    if logger.handlers:
        return logger

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(
        ColorFormatter(
            f"[%(asctime)s] %(levelname)s %(name)s: %(message)s", datefmt=DATE_FORMAT
        )
    )

    log_dir = os.getenv("LOG_DIR", "")

    error_path = os.path.join(log_dir, "error.log") if log_dir else "error.log"
    combined_path = os.path.join(log_dir, "combined.log") if log_dir else "combined.log"

    file_handler = logging.FileHandler(error_path)
    file_handler.setLevel(logging.ERROR)
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))

    combined_handler = logging.FileHandler(combined_path)
    combined_handler.setLevel(logging.DEBUG)
    combined_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    logger.addHandler(combined_handler)

    return logger


logger = setup_logger()
